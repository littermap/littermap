//
// This is the center piece of the internal data model that the user interface reacts to
//

import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import createAgent from "./createAgent"
import createUserProfile from "./createUserProfile"
import { map } from "../../map"

const StoreContext = createContext()

export function Provider(props) {
  let profile

  const [state, setState] = createStore({
    get profile() {
      return profile()
    },
    mapZoom: 0,
    showingStreetView: false,
    menuVisible: false,
    currentLocation: null,
    viewingLocation: false,
    editingNewLocation: false
  })

  // Actions that modify the internal state of the application
  const actions = {
    hideMenu() { setState({ menuVisible: false }) },
    toggleMenu() { setState({ menuVisible: !state.menuVisible }) },
    hideEditNewLocation() {
      setState({ editingNewLocation: false })
      window.hideEditNewLocation()
    }
  }

  // External interface of the data store (read current state, perform actions that change the state)
  const store = [state, actions]

  // Asynchronous requests module
  const agent = createAgent(store)

  profile = createUserProfile(agent, actions)

  //
  // Actions that are accessible by DOM level script code
  //

  window.onBoundsChanged = () => {
    setState({ mapZoom: map.getZoom() })
  }

  window.onEnterExitStreetView = (entered) => {
    setState({ showingStreetView: entered })
  }

  window.showViewLocation = (value, data) => {
    setState({
      viewingLocation: value,
      currentLocation: data || null
    })
  }

  window.showEditNewLocation = (value) => {
    setState({ editingNewLocation: value })
  }

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}

// Gives access to the data store
export function useStore() {
  return useContext(StoreContext)
}
