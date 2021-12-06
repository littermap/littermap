//
// View or edit a location
//

import { submitLocation } from '../../map'
import createDescription from './parts/Description'
import createLevel from './parts/Level'
import createPhotos from './parts/Photos'

const defaults = {
  description: '',
  level: 10
}

export default createLocationInfo = (store, existingLocation) => {
  let [, { closeEditNewLocation }] = store

  const description = createDescription({
    initialValue: !existingLocation ? defaults.description : existingLocation.description,
    pureEdit: !existingLocation
  })

  const level = createLevel({
    initialValue: !existingLocation ? defaults.level : existingLocation.level,
    pureEdit: !existingLocation
  })

  const photos = createPhotos({
    initialItems: !existingLocation ? [] : existingLocation.images,
    pureEdit: !existingLocation
  })

  function cancel() {
    closeEditNewLocation()
  }

  function submit() {
    let details = {
      description: description.getValue(),
      level: level.getValue(),
      images: photos.getItems()
    }

    closeEditNewLocation()

    submitLocation(details)
  }

  const render = () => (
    <>
      <description.render />
      <level.render />
      <photos.render />

      <Show when={!existingLocation}>
        <section class="buttons">
          <button onclick={cancel}>
            Cancel
          </button>
          <button onclick={submit} disabled={photos.isBusy()}>
            Submit
          </button>
        </section>
      </Show>

      <Switch>
        <Match when={!existingLocation && store.profile}>
          <p class="info">
            You are logged in as {store.profile.name}
          </p>
        </Match>
        <Match when={existingLocation}>
          <p class="info">
            Submitted by {existingLocation.created_by || "someone"} at {existingLocation.created_at}
          </p>
        </Match>
      </Switch>
    </>
  )

  return { render }
}
