//
// What's rendered on top of the map
//

import { toggleBaseLayer, geolocateMe } from '../map'
import { LayersGlyph, NavigateGlyph } from '../elements/glyphs'
import AddressSearch from './AddressSearch'
import ProfileAvatar from './ProfileAvatar'
import MainStore from '../store'

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
    <Show when={store.mapLoaded}>
      <Portal mount={document.getElementById('map')}>
        <Show when={!store.showingStreetView}>
          <AddressSearch />
          <ProfileAvatar />
          <div id="map-buttons">
            <Show when={navigator.geolocation}>
              <button id="geolocate" onclick={geolocateMe}>
                <NavigateGlyph />
              </button>
            </Show>
            <button id="switch-layers" onclick={toggleBaseLayer}>
              <LayersGlyph />
            </button>
          </div>
        </Show>
        <Show when={suggestion()}>
          <div id="hint">
            <p>
              {suggestion()}
            </p>
          </div>
        </Show>
      </Portal>
    </Show>
  )
}
