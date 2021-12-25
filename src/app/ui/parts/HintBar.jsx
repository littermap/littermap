//
// Hint bar that shows a suggestion
//

import MainStore from '../../main-store'

export default () => {
  const [store] = MainStore()

  const suggestion = () => (
    store.showingStreetView
      ? "Take a closer look"
      : (
          !store.profileLoading && !store.editingNewLocation ?
            (!store.profile ? "Log in" :
              (store.mapZoom < config.map.min_add_location_zoom ? "Zoom in" : "Tap and hold")
            )
            + " to add a littered location"
          : null
        )
  )

  return (
    <Show when={suggestion()}>
      <div id="hint">
        <p>
          {suggestion()}
        </p>
      </div>
    </Show>
  )
}
