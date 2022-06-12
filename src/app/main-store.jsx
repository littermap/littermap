//
// The central application state that the user interface dynamically reacts to
//

import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { closeSubmitPopup } from './map'
import createProfile from './resources/user-profile'
import createLocationInfo from './ui/parts/location-info/location-info'

const StoreContext = createContext()

export function MainStoreProvider(props) {
  let profile

  // Reactive store for the state
  const [state, setState] = createStore({
    get profile() {
      return profile()
    },
    get profileLoading() {
      return profile.loading
    },
    loggingIn: false,
    mapLoaded: false,
    mapZoom: 0,
    showingStreetView: false,
    showingMenu: false,
    viewingLocations: [],
    editingNewLocations: [],
    viewingImages: null,
    currentImage: null,
    keyboardCaptured: false
  })

  // Actions that change the state
  const actions = {
    toggleMenu() {
      setState({ showingMenu: !state.showingMenu })
    },
    hideMenu() {
      setState({ showingMenu: false })
    },
    captureKeyboard(value) {
      setState({ keyboardCaptured: value })
    },
    initiateLogin() {
      setState({ loggingIn: true })
    },
    closeEditNewLocation() {
      setState({ editingNewLocation: false })
      closeSubmitPopup()
    },
    viewImage(value) {
      if (typeof value === "number") {
        setState({
          currentImage: value
        })
      } else if (typeof value === "object") {
        setState({
          viewingImages: value.images,
          currentImage: value.idx
        })
      } else {
        setState({
          viewingImages: null,
          currentImage: null
        })
      }
    },
    viewPrevImage() {
      setState({ currentImage: (state.currentImage + 1) % state.viewingImages.length })
    },
    viewNextImage() {
      setState({
        currentImage: state.currentImage !== 0 ? state.currentImage - 1 : state.viewingImages.length - 1
      })
    }
  }

  // Actions meant to be invoked by global script code
  window.actions = {
    setMapLoaded() {
      setState({ mapLoaded: true })
    },
    updateZoom(zoomLevel) {
      setState({ mapZoom: zoomLevel })
    },
    updateShowingStreetView(value) {
      setState({ showingStreetView: value })
    },
    updateViewingLocation(value) {
      setState({ viewingLocations: value ? [createLocationInfo(value)] : [] })
    },
    updateEditingNewLocation(value) {
      setState({ editingNewLocations: value ? [createLocationInfo()] : [] })
    }
  }

  // Make application state available to global script code
  window.state = state

  // Reset transitional state on "page unload" in case the browser keeps the page state and reinstates it when using the back button
  window.addEventListener('unload', () => {
    setState({ loggingIn: false })
  })

  profile = createProfile(actions)

  return (
    <StoreContext.Provider value={[state, actions]}>
      {props.children}
    </StoreContext.Provider>
  )
}

// Gives access to the data store (must be called at render time)
export default function MainStore() {
  return useContext(StoreContext)
}
