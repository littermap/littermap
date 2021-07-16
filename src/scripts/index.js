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

  // Create the map
  map = L.map('map', {
    layers: [mapboxStreets]
  })

  // Show Raleigh-Durham area by default
  map.setView([35.8579, -78.8442], 10)

  // Add layer switcher control
  L.control.layers(
    {
      "Mapbox Streets": mapboxStreets,
      "OpenStreetMap Standard": osmStandard
    },
    null // Overlays (none yet)
  ).addTo(map)

  // Add "locate me" control
  //
  // Add-on options: https://github.com/domoritz/leaflet-locatecontrol#possible-options
  L.control.locate({
    strings: {
      title: "Locate me"
    }
  }).addTo(map)

  // Remove the default 'Leaflet' prefix from the attribution line and mention OpenStreetMap
  map.attributionControl.setPrefix().addAttribution("Map data from OpenStreetMap")
}

async function loadLocations() {
  let url = "https://web.fulcrumapp.com/shares/58738b7d41051b7d.geojson"

  console.log("Fetching litter locations...")
  let res = await fetch(url)

  if (res.ok) {
    console.log("Received litter location data")
    let json = await res.json()
    let count = json.features.length
    let countInfo = count + ((count !== 1) ? " locations" : " location")

    document.getElementById("location-count").innerText = countInfo

    if (markers)
      map.removeLayer(markers)

    markers = L.geoJson(json).addTo(map).bindPopup("Someone has reported seeing litter here.")
  } else
    console.log("Failed to fetch litter locations: " + res.status)
}

initMap()
loadLocations()

function submitLocation() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(sendPosition)
  else
    alert("Geolocation API is not supported by this browser.")

  function sendPosition(position) {
    let lat = position.coords.latitude
    let lon = position.coords.longitude

    let request = new XMLHttpRequest()
    request.open('POST', 'https://42904.wayscript.io/')

    let data = JSON.stringify({lat, lon})
    alert("Submitting: " + data)
    request.send(data)

    request.onload = () => {
      alert("Thank you for submitting this point.")
      alert("Help us crowd source environmental cleanup by building a knowledgebase of locations that need litter and or plastic pollution cleanup. Become a part of the process to clean up the planet and restore it to its natural beauty with the ease of “spotting” locations that others can attend to. If you are one of the thousands of cleanup enthusiasts, use the map to locate your next cleanup.")

      loadLocations()
    }
  }
}
