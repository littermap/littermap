import { createSignal, createResource, For } from 'solid-js'
import { goTo, getCenter } from '../map'

//
// Zoom defaults by Mapbox place type
//
// Reference: https://docs.mapbox.com/api/search/geocoding/#data-types
//
const zooms = {
  address: 19,
  neighborhood: 15,
  place: 11,
  poi: 17,
  country: 5,
  region: 8,
  postcode: 11,
  district: 9,
  locality: 12
}

export default () => {
  // What's in the input field
  const [searchInput, setSearchInput] = createSignal("")

  // What's been submitted as a query from the input field
  const [searchQuery, setSearchQuery] = createSignal("")

  // Which result is currently selected
  const [selected, setSelected] = createSignal(null)

  // Fetch results when search query changes
  const [searchResults] = createResource(
    searchQuery,
    lookUpAddress,
    { initialValue: [] }
  )

  // Perform search
  const submitInput = (event) => {
    var inputElement = document.getElementById("address-input")
    setSearchQuery(inputElement.value)
    event.preventDefault()
  }

  // Store current input value
  const inputChanged = (event) => {
    setSearchInput(event.target.value)
  }

  // Stop showing the search results
  const closeSearchResults = () => {
    setSearchQuery("")
    setSelected(null)
  }

  // Clear the search including the search field
  const resetSearch = () => {
    inputElement = document.getElementById("address-input").value = ''
    closeSearchResults()
  }

  // Navigate search results with the keyboard
  const keydown = event => {
    let results = searchResults()
    let count = results.length

    if (count === 0)
      return

    let idx = selected()

    switch(event.which) {
      case 38: // Up
        if (idx === null || idx === 0)
          idx = count - 1
        else
          idx--

        setSelected(idx)
        break
      case 40: // Down
        if (idx === null || idx === count - 1)
          idx = 0
        else
          idx++

        setSelected(idx)
        break
      case 27: // Escape
        resetSearch()
        break
      case 13: // Return
        if (idx !== null) {
          if (searchInput() === searchQuery()) {
            goToSearchResult(results[idx])
            resetSearch()
          }
        }
    }
  }

  const resultClicked = (event) => {
    const item = searchResults()[
      parseInt(event.target.getAttribute('data-index'))
    ]

    goToSearchResult(item)
    resetSearch()
  }

  // Configure a hot key to focus the input field
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Slash') {
      var inputElement = document.getElementById("address-input")

      if (event.target !== inputElement) {
        event.preventDefault()
        inputElement.focus()
      }
    }
  })

  return (
    <>
      <Show when={searchResults().length > 0}>
        <div class="click-screen" onclick={closeSearchResults} />
      </Show>
      <div id="address-search" onkeydown={keydown}>
        <form id="address-input-form" onsubmit={submitInput}>
          <input id="address-input" type="text" oninput={inputChanged} placeholder="🔍" />
        </form>
        <div id="search-results">
          <For each={searchResults()}>
            {(result, i) => (
              <div class="result" classList={{selected: selected() === i()}} data-index={i()} onclick={resultClicked}>
                {result.place_name}
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  )
}

function goToSearchResult(item) {
  const coords = item.center

  goTo({
    lat: coords[1],
    lon: coords[0],
    zoom: zooms[item.place_type]
  })
}

async function lookUpAddress(input) {
  input = input.trim()

  if (input === "")
    return []

  //
  // Reference: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
  //

  const api = "https://api.mapbox.com/geocoding/v5/mapbox.places"

  // Use current location to influence search results
  let { lat, lon } = getCenter()

  let url = `${api}/${input}.json?access_token=${config.credentials.mapbox.access_token}&proximity=${lon},${lat}`

  console.log('Address search:', input)
  let response = await fetch(url)

  try {
    const json = await response.json()
    return json.features ? json.features : []
  } catch(e) {
    return []
  }
}
