import { createEffect } from 'solid-js'
import { useStore } from '../store'
import { toggleBaseLayer, geolocateMe, submitLocation } from '../../map'
import AddressSearch from '../parts/AddressSearch'

export default () => {
  const [store] = useStore()

  const suggestion = () => (
    store.showingStreetView
      ? "Take a closer look"
      : (
          !store.profileLoading ?
            (!store.profile ? "Log in" :
              (store.mapZoom < config.map.min_add_location_zoom ? "Zoom in" : "Tap and hold")
            )
            + " to add a littered location"
          : null
        )
  )

  return (
    <>
      <Show when={!store.showingStreetView}>
        <AddressSearch />
        <button id="switch-layers" class="map-control" onclick={toggleBaseLayer}>
          ⿻
        </button>
        <Show when={navigator.geolocation}>
          <button id="geolocate" class="map-control" onclick={geolocateMe}>
            ⊚
          </button>
        </Show>
      </Show>
      <Show when={suggestion()}>
        <div id="hint">
          <p>
            {suggestion()}
          </p>
        </div>
      </Show>
    </>
  )
}
