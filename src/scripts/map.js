import L from 'leaflet'
import locate from 'leaflet.locatecontrol'
import styles from './bundled.css'

var map, markers = null

function initMap() {
  // Mapbox API token from Leaflet examples
  var mapboxAPIToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"

  //
  // Mapbox Streets layer
  //
  // Read more: https://www.mapbox.com/maps/streets/
  //
  var mapboxStreets = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAPIToken,
    {
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }
  )

  //
  // OpenStreetMap standard layer
  //
  // Read more: https://wiki.openstreetmap.org/wiki/Standard_tile_layer
  //
  var osmStandard = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18
    }
  )

  //
  // Google Maps hybrid layer
  //
  var googleMaps = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    {
      subdomains: ['mt0','mt1','mt2','mt3'],
      maxZoom: 20
    }
  )

  // Create the map
  map = L.map('map', {
    layers: [googleMaps]
  })

  // Show Raleigh-Durham area by default
  map.setView([35.8579, -78.8442], 10)

  // Add layer switcher control
  L.control.layers(
    {
      "Google Maps": googleMaps,
      "Mapbox Streets": mapboxStreets,
      "OpenStreetMap Standard": osmStandard
    },
    null // No overlays (yet)
  ).addTo(map)

  // Add "locate me" control
  //
  // Add-on options: https://github.com/domoritz/leaflet-locatecontrol#possible-options
  L.control.locate({
    strings: {
      title: "Locate me"
    }
  }).addTo(map)

  // Customize the attribution line
  map.attributionControl.setPrefix().addAttribution("Map data from map provider")

  map.on("moveend", loadLocations)

  // Allow interaction with the map object from the console in development builds
  if (config.development) {
    window.map = map
  }
}

function getViewRadius() {
  let bounds = map.getBounds()

  let x = (bounds._northEast.lng - bounds._southWest.lng) / 2
  let y = (bounds._northEast.lat - bounds._southWest.lat) / 2

  return Math.sqrt(x*x + y*y)
}

async function loadLocations() {
  let { lat, lng } = map.getCenter()
  let radius = getViewRadius()

  console.log("View radius: " + radius)

  let url = `/radius/?lat=${lat}&lon=${lng}&r=${radius}&format=geojson`

  console.log("Fetching litter locations...")
  let res = await fetch(config.backend + url)

  if (res.ok) {
    let json = await res.json()
    let count = json.features.length
    let countInfo = count + ((count !== 1) ? " locations" : " location")

    console.log("Received " + countInfo)
    document.getElementById("location-count").innerText = countInfo + " visible"

    if (markers)
      map.removeLayer(markers)

    markers = L.geoJson(json).addTo(map).bindPopup("Someone has reported seeing litter here.")
  } else
    console.log("Failed to fetch litter locations: " + res.status)
}

export function submitLocation() {
  let { lat, lng } = map.getCenter()

  let request = new XMLHttpRequest()
  request.open('POST', config.backend + '/add')
  request.withCredentials = true

  let data = JSON.stringify({lat, lon: lng})
  request.send(data)

  request.onload = () => {
    alert("Thank you for submitting this point.\n\nHelp us crowd source environmental cleanup by building a knowledge base of locations that need litter and/or plastic pollution cleanup. Become a part of the process to clean up the planet and restore it to its natural beauty with the ease of “spotting” locations that others can attend to. If you are one of the thousands of cleanup enthusiasts worldwide, use the map to locate your next cleanup.")

    loadLocations()
  }
}

initMap()
loadLocations()

window.submitLocation = submitLocation
