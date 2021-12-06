//
// The central data store that the user interface dynamically reacts to
//

import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { closeSubmitPopup } from '../map'
import agent from '../request-agent'
import Profile from './user-profile'
import createLocationInfo from '../parts/LocationInfo'

const StoreContext = createContext()

export function StoreProvider(props) {
  let profile, store

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
    editingNewLocations: []
  })

  // Actions meant to be invoked by UI components
  const actions = {
    hideMenu() {
      setState({ showingMenu: false })
    },
    toggleMenu() {
      setState({ showingMenu: !state.showingMenu })
    },
    initiateLogin() {
      setState({ loggingIn: true })
    },
    closeEditNewLocation() {
      setState({ editingNewLocation: false })
      closeSubmitPopup()
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
      setState({ viewingLocations: value ? [createLocationInfo(store, value)] : [] })
    },
    updateEditingNewLocation(value) {
      setState({ editingNewLocations: value ? [createLocationInfo(store)] : [] })
    }
  }

  // Make application state available to global script code
  window.state = state

  // Reset transitional state on "page unload" in case the browser keeps the page state and reinstates it when using the back button
  window.addEventListener('unload', () => {
    setState({ loggingIn: false })
  })

  // Interface to the data store (read current state, perform actions that change the state)
  store = [state, actions]

  profile = Profile(actions)

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}

// Gives access to the data store
export default function useStore() {
  return useContext(StoreContext)
}
