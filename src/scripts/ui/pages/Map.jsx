import { createEffect } from 'solid-js'
import { useStore } from '../../store'
import { submitLocation } from '../../map'
import AddressSearch from '../AddressSearch'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

  return (
    <>
      <AddressSearch />
      <button id="submit-location" onclick={submitLocation}>
        Add Location
      </button>
    </>
  )
}
