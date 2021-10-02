import { createEffect } from 'solid-js'
import { useStore } from '../../store'
import { toggleBaseLayer, geolocateMe, submitLocation } from '../../map'
import AddressSearch from '../AddressSearch'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

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
      <button id="submit-location" onclick={submitLocation}>
        Add Location
      </button>
    </>
  )
}
