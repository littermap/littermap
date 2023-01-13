import { debounce } from './utils/debounce'

let map, infoPopup, submitPopup, points = []

let initialLocation = {
  lat: config.map.defaults.lat,
  lon: config.map.defaults.lon
}

const submitPopupContent = {
  ask: '<span id="add-location" onclick="editNewLocation()" style="font-weight: bold">Add litter location?</span>',
  edit: '<div class="location-info" id="edit-new-location"></div>'
}

const infoPopupContent = {
  view: '<div class="location-info" id="view-location"></div>'
}

function initMap() {
  let mapElement = document.getElementById('map')

  //
  // Google Maps API
  //   https://developers.google.com/maps/documentation/javascript/reference/
  //

  map = new google.maps.Map(mapElement, {
    center: new google.maps.LatLng(
      initialLocation.lat,
      initialLocation.lon
    ),
    zoom: config.map.defaults.zoom,
    minZoom: 2,
    restriction: {
      latLngBounds: {
        // Limit north/south view
        north: 85,
        south: -85,
        // Let east/west wrap
        west: -180,
        east: 180
      },
      // Prevent zooming out beyond the complete view
      strictBounds: true
    },
    mapTypeId: google.maps.MapTypeId.HYBRID,
    mapTypeControl: false,
    fullscreenControl: false,
    // Enable all touch and scroll events
    gestureHandling: "greedy"
  })

  const streetView = map.getStreetView()

  // Hide the full screen control in street view mode
  streetView.setOptions({
    fullscreenControl: false
  })

  infoPopup = new google.maps.InfoWindow({
    content: infoPopupContent.view
  })

  google.maps.event.addListener(infoPopup, 'closeclick', () => {
    window.actions.updateViewingLocation(null)
  })

  submitPopup = new google.maps.InfoWindow({
    maxWidth: "none"
  })

  google.maps.event.addListener(submitPopup, 'closeclick', () => {
    window.actions.updateEditingNewLocation(false)
  })

  map.addListener("click", () => {
    window.actions.updateViewingLocation(null)
    infoPopup.close()
  })

  // Listen to mouse events (for detecting long clicks)
  map.addListener("mousedown", mapMouseDown)
  map.addListener("mouseup", mapMouseUp)

  // Respond to changes in map view
  map.addListener("bounds_changed", boundsChanged)
  map.addListener("zoom_changed", zoomChanged)

  // Respond to entering and exiting street view mode
  google.maps.event.addListener(streetView, "visible_changed",
    () => {
      window.actions.updateShowingStreetView(streetView.getVisible())
    }
  )

  // Focus the map, so the keyboard shortcuts work right away
  google.maps.event.addListenerOnce(map, 'tilesloaded',
    () => {
      // The element that receives keyboard input can be selected this way at this particular stage of loading
      mapElement.children[0].children[0].children[0].focus()
    }
  )

  zoomChanged()

  window.actions.setMapLoaded()

  // Allow interaction with the map object from the console during development
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

  // If the map center has moved, this is a drag and not a long click
  if (downState.center.lat === center.lat && downState.center.lon === center.lon)
    // If logged in
    if (window.state.profile)
      // If zoomed in enough
      if (map.getZoom() >= config.map.min_add_location_zoom)
        offerToAddLocation({lat, lon})

  downState = null
}

let candidateLocation

function offerToAddLocation({lat, lon}) {
  candidateLocation = {lat, lon}

  submitPopup.setPosition(
    new google.maps.LatLng(lat, lon)
  )

  submitPopup.setContent(
    submitPopupContent.ask
  )

  window.actions.updateEditingNewLocation(false)

  submitPopup.open({
    map
  })
}

function editNewLocation() {
  submitPopup.setContent(
    submitPopupContent.edit
  )

  window.actions.updateEditingNewLocation(true)

  //
  // Center the view on the popup 
  //
  // TODO: Consider adjusting the view just enough to accommodate the popup
  //
  map.panTo(
    new google.maps.LatLng(
      candidateLocation.lat, candidateLocation.lon
    )
  )
}

function closeSubmitPopup() {
  submitPopup.close()
}

function goTo({ lat, lon, zoom }) {
  if (map) {
    map.setCenter({ lat, lng: lon })

    if (zoom)
      map.setZoom(zoom)
  } else {
    initialLocation = { lat, lon }
  }
}

function getCenter() {
  let { lat, lng } = map.getCenter()

  return {
    lat: lat(),
    lon: ((((lng() + 180) % 360) + 360) % 360) - 180 // Wrap longitude to [-180, 180]
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

function toggleBaseLayer() {
  map.setMapTypeId(
    map.getMapTypeId() === "hybrid" ? "roadmap" : "hybrid"
  )
}

function geolocateMe() {
  navigator.geolocation.getCurrentPosition(
    (position) => { // If position is returned...
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
}

function zoomChanged() {
  window.actions.updateZoom(map.getZoom())
}

var requestLocations = debounce(loadLocations, config.map.fetch_interval, config.map.fetch_delay)

let cancel

async function loadLocations() {
  let { lat, lon } = getCenter()
  let radius = getViewRadius()

  let url = `/radius?lat=${lat}&lon=${lon}&r=${radius}&format=geojson`

  if (config.debug.network)
    console.info("Fetching:", url)

  // Abort previous request
  if (cancel)
    cancel.abort()

  cancel = new AbortController()
  const signal = cancel.signal

  let res

  try {
    res = await fetch(config.routes.api + url, { signal })
  } catch(e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      // It is perfectly normal for a request to be aborted due to a newer request taking its place
      if (config.debug.network)
        console.info("Existing active litter location fetch request cancelled by newer fetch request")
    } else {
      console.error(e)
      console.info("Failed to fetch litter locations")
    }

    // The request failed and no locations will be loaded this time
    return
  }

  cancel = null

  if (res.ok) {
    let json = await res.json()
    let count = json.features.length

    console.info("Received " + count + ((count !== 1) ? " locations" : " location"))

    renderLocations(json.features)
  } else
    console.info("Failed to fetch litter locations: " + res.status)
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

      let point = {
        data: item.properties,
        hash: item.properties.hash,
        coords: {
          lat: coords[1],
          lon: coords[0]
        },
        marker
      }

      marker.addListener("click", () => {
        infoPopup.open({
          anchor: marker,
          map
        })

        setTimeout(() => {
          window.actions.updateViewingLocation(point.data)
        })
      })

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

function submitLocation({description, level, images}) {
  submitPopup.close()

  let data = {
    ...candidateLocation,
    description,
    level,
    images
  }

  let request = new XMLHttpRequest()
  request.open('POST', config.routes.api + '/add')
  request.withCredentials = true
  request.send(JSON.stringify(data))

  request.onload = () => {
    if (request.status >= 200 && request.status <= 299) {
      alert("Thank you for submitting this point.\n\nHelp us crowd source environmental cleanup by building a knowledge base of locations that need litter and/or plastic pollution cleanup. Become a part of the process to clean up the planet and restore it to its natural beauty with the ease of “spotting” locations that others can attend to. If you are one of the thousands of cleanup enthusiasts worldwide, use the map to locate your next cleanup.")

      loadLocations()
    } else
      alert("Error submitting location")
  }
}

//adding daniels location here
google.maps.event.addListenerOnce(map, addDaniel)
function addDaniel() {
  try {
    let response = await fetch(config.routes.media + 'media/daniel.json')
    let data = await response
    // Create a new marker
    new google.maps.Marker({
      position: {lat: parseFloat(data.lat), lng: parseFloat(data.lng)},
      map: map,
      icon: {
        url: "/images/daniel.png",
        scaledSize: new google.maps.Size(55, 55)
      }
    })
  } catch (e) {
    console.log(e);
  }
}

//ending add daniels location here

export {
  map,
  goTo,
  getCenter,
  toggleBaseLayer,
  geolocateMe,
  closeSubmitPopup,
  submitLocation
}

//
// Expose this so it can be invoked from the submit popup event handler
//
window.editNewLocation = editNewLocation

//
// Expose this so the Google Maps API script can invoke it
//
window.initMap = initMap
//
// Expose this so the Google Maps API script can invoke it
//
window.addDaniel = addDaniel
