var map, popup, points = []

export { map }

export function initMap() {
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
    fullscreenControl: false,
    gestureHandling: "greedy" // React to all touch and scroll events
  })

  popup = new google.maps.InfoWindow({
    content: "Someone has reported seeing litter here."
  })

  map.addListener("click", () => {
    popup.close()
  })

  map.addListener("bounds_changed", boundsChanged)

  // Allow interaction with the map object from the console in development builds
  if (config.development) {
    window.map = map
  }
}

let debouncing = false
let needToUpdate = false

function boundsChanged() {
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
      config.map.update_debounce
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
        popup.open({
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

export function submitLocation() {
  let data = JSON.stringify(getCenter())

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
// This is to let the Google Maps script trigger initMap()
//
window.initMap = initMap
