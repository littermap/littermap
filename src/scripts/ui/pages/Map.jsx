import { createEffect } from 'solid-js'
import { useStore } from '../../store'
import { toggleBaseLayer, geolocateMe, submitLocation } from '../../map'
import AddressSearch from '../AddressSearch'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

  const suggestion = () => (
    store.mapZoom < config.map.min_add_location_zoom ? "Zoom in" : "Tap and hold"
  )

  return (
    <>
      <AddressSearch />
      <button id="switch-layers" class="map-control" onclick={toggleBaseLayer}>
        ▱
      </button>
      <Show when={navigator.geolocation}>
        <button id="geolocate" class="map-control" onclick={geolocateMe}>
          ⊚
        </button>
      </Show>
      <div id="hint">
        <p>
          {suggestion()} to add a littered location
        </p>
      </div>
    </>
  )
}
