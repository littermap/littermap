import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import createAgent from "./createAgent"
import createUserProfile from "./createUserProfile"

const StoreContext = createContext()

export function Provider(props) {
  let profile

  const [state, setState] = createStore({
      get profile() {
        return profile()
      }
    })

  const actions = {}
  const store = [state, actions]
  const agent = createAgent(store)

  profile = createUserProfile(agent, actions, setState)

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
