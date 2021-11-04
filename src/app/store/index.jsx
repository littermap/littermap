//
// The central data store that the user interface dynamically reacts to
//

import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { closeSubmitPopup } from '../map'
import agent from '../request-agent'
import Profile from './user-profile'

const StoreContext = createContext()

export function StoreProvider(props) {
  let profile

  const [state, setState] = createStore({
    get profile() {
      return profile()
    },
    get profileLoading() {
      return profile.loading
    },
    mapLoaded: false,
    mapZoom: 0,
    showingStreetView: false,
    menuVisible: false,
    viewingLocation: null,
    editingNewLocation: false
  })

  // Actions meant to be invoked by UI components
  const actions = {
    hideMenu() {
      setState({ menuVisible: false })
    },
    toggleMenu() {
      setState({ menuVisible: !state.menuVisible })
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
      setState({ viewingLocation: value })
    },
    updateEditingNewLocation(value) {
      setState({ editingNewLocation: value })
    }
  }

  // Make application state available to global script code
  window.state = state

  // Interface to the data store (read current state, perform actions that change the state)
  const store = [state, actions]

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
