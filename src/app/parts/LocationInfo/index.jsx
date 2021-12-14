//
// View or edit a location's details
//

import { submitLocation } from '../../map'
import createDescription from './parts/fields/Description'
import createLevel from './parts/fields/Level'
import createPhotos from './parts/fields/Photos'

const defaults = {
  description: '',
  level: 10
}

export default createLocationInfo = (mainStore, existingLocation) => {
  let [store, { closeEditNewLocation }] = mainStore

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
      description: description.getInputValue(),
      level: level.getInputValue(),
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
          <button onclick={submit} disabled={photos.isBusy() || !level.isValid()}>
            Submit
          </button>
          <button onclick={cancel}>
            Cancel
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
