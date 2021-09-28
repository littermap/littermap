import { createEffect } from 'solid-js'
import { useStore } from '../../store'
import { submitLocation } from '../../map'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

  return (
    <button id="submit-location" onclick={submitLocation}>
      Add Location
    </button>
  )
}
