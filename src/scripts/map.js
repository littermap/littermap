var map, infoPopup, askSubmitPopup, points = []

export { map }

function initMap() {
  //
  // Google Maps API
  //
  // Documentation: https://developers.google.com/maps/documentation/javascript/reference/
  //

  element = document.getElementById('map')

  map = new google.maps.Map(element, {
    center: new google.maps.LatLng(35.899532, -79.056473),
    zoom: config.map.default_zoom,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    mapTypeControl: false,
    fullscreenControl: false,
    // React to all touch and scroll events
    gestureHandling: "greedy"
  })

  const streetView = map.getStreetView()

  // Hide the full screen control in street view mode
  streetView.setOptions({
    fullscreenControl: false
  })

  infoPopup = new google.maps.InfoWindow({
    content: "Someone has reported seeing litter here."
  })

  askSubmitPopup = new google.maps.InfoWindow({
    content: '<span id="add-location" onclick="submitLocation()" style="font-weight: bold">Add litter location?</span>'
  })

  map.addListener("click", () => {
    infoPopup.close()
  })

  // Tap into mouse events to detect long clicks
  map.addListener("mousedown", mapMouseDown)
  map.addListener("mouseup", mapMouseUp)

  // Respond to changes in map bounds
  map.addListener("bounds_changed", boundsChanged)

  // Respond to entering and exiting street view mode
  google.maps.event.addListener(streetView, "visible_changed",
    function() {
      if (window.onEnterExitStreetView)
        window.onEnterExitStreetView(this.getVisible())
    }
  )

  // Allow interaction with the map object from the console (in development)
  if (config.development) {
    window.map = map
  }
}

let downState

function mapMouseDown(event) {
  where = event.latLng

  where = {
    lat: where.lat(),
    lon: where.lng()
  }

  if (downState)
    clearTimeout(downState.timer)

  downState = {
    center: getCenter(),
    timer: setTimeout(() => {
      checkLongClicked(where, 700)
    }, config.map.long_click_interval)
  }

}

function mapMouseUp() {
  if (downState) {
    clearTimeout(downState.timer)
    downState = null
  }
}

function checkLongClicked({lat, lon}) {
  let center = getCenter()

  // If the map center has moved, this is not a long click
  if (downState.center.lat === center.lat && downState.center.lon === center.lon)
    if (map.getZoom() >= config.map.min_add_location_zoom)
     offerToAddLocation({lat, lon})

  downState = null
}

let candidateLocation

function offerToAddLocation({lat, lon}) {
  candidateLocation = {lat, lon}

  askSubmitPopup.setPosition(
    new google.maps.LatLng(lat, lon)
  )

  askSubmitPopup.open({
    map
  })
}

export function goTo({ lat, lon, zoom}) {
  map.setCenter({lat, lng: lon})

  if (zoom)
    map.setZoom(zoom)
}

export function getCenter() {
  let { lat, lng } = map.getCenter()

  return {
    lat: lat(),
    lon: lng()
  }
}

function getViewRadius() {
  let bounds = map.getBounds()

  let ne = bounds.getNorthEast()
  let sw = bounds.getSouthWest()

  let x = (ne.lng() - sw.lng()) / 2
  let y = (ne.lat() - sw.lat()) / 2

  return Math.sqrt(x*x + y*y)
}

export function toggleBaseLayer() {
  map.setMapTypeId(
    map.getMapTypeId() === "hybrid" ? "roadmap" : "hybrid"
  )
}

export function geolocateMe() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }

      goTo({ ...pos, zoom: 16 })
    }
  )
}

function boundsChanged() {
  requestLocations()

  if (window.onBoundsChanged)
    window.onBoundsChanged()
}

let debouncing = false
let needToUpdate = false

function requestLocations() {
  if (!debouncing) {
    debouncing = true
    loadLocations()

    setTimeout(
      () => {
        debouncing = false

        if (needToUpdate) {
          needToUpdate = false
          loadLocations()
        }
      },
      config.map.data_update_debounce
    )
  } else
    needToUpdate = true
}

async function loadLocations() {
  let { lat, lon } = getCenter()
  let radius = getViewRadius()

  let url = `/radius/?lat=${lat}&lon=${lon}&r=${radius}&format=geojson`

  console.log("Fetching litter locations...")
  let res = await fetch(config.backend + url)

  if (res.ok) {
    let json = await res.json()
    let count = json.features.length
    let countInfo = count + ((count !== 1) ? " locations" : " location")

    console.log("Received " + countInfo)
    document.getElementById("location-count").innerText = countInfo + " visible"

    renderLocations(json.features)
  } else
    console.log("Failed to fetch litter locations: " + res.status)
}

function renderLocations(features) {
  //
  // Render new markers first and then remove old markers that aren't in the new set
  //
  let newPoints = []

  features.forEach((item) => {
    let hash = item.properties.hash

    let found = points.findIndex((x) => x.hash === hash)

    if (found !== -1) {
      newPoints.push(points[found])
      points.splice(found, 1)
    } else {
      let coords = item.geometry.coordinates
      let data = item.properties

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(coords[1], coords[0]),
        // icon: {
        //   url: "favicon.ico",
        //   scaledSize: new google.maps.Size(30, 30)
        // },
        map
      })

      marker.addListener("click", () => {
        infoPopup.open({
          anchor: marker,
          map
        })
      })

      let point = {
        data: item.properties,
        hash: item.properties.hash,
        coords: {
          lat: coords[1],
          lon: coords[0]
        },
        marker
      }

      newPoints.push(point)
    }
  })

  //
  // Remove markers from the map that aren't in the new set
  //
  points.forEach((item) => {
    item.marker.setMap(null)
  })

  points = newPoints

  if (config.development) {
    window.points = points
  }
}

export function submitLocation() {
  askSubmitPopup.close()

  let data = JSON.stringify(candidateLocation)

  let request = new XMLHttpRequest()
  request.open('POST', config.backend + '/add')
  request.withCredentials = true
  request.send(data)

  request.onload = () => {
    alert("Thank you for submitting this point.\n\nHelp us crowd source environmental cleanup by building a knowledge base of locations that need litter and/or plastic pollution cleanup. Become a part of the process to clean up the planet and restore it to its natural beauty with the ease of “spotting” locations that others can attend to. If you are one of the thousands of cleanup enthusiasts worldwide, use the map to locate your next cleanup.")

    loadLocations()
  }
}

//
// This is to make it accessible from the submit confirmation info window
//
window.submitLocation = submitLocation

//
// This is to let the Google Maps script trigger initMap()
//
window.initMap = initMap
