import { createEffect } from 'solid-js'
import { useStore } from '../../store'
import { geolocateMe, submitLocation } from '../../map'
import AddressSearch from '../AddressSearch'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

  return (
    <>
      <AddressSearch />
      <Show when={navigator.geolocation}>
        <button id="geolocate" onclick={geolocateMe}>
          ⊚
        </button>
      </Show>
      <button id="submit-location" onclick={submitLocation}>
        Add Location
      </button>
    </>
  )
}
