//
// View or edit a location's details
//

import { submitLocation } from '../../../map'
import createDescription from './fields/description'
import createLevel from './fields/level'
import createPhotos from './fields/photos'
import MainStore from '../../../main-store'

const defaults = {
  description: '',
  level: 10
}

export default createLocationInfo = (existingLocation) => {
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

  const render = () => {
    let [store, { closeEditNewLocation }] = MainStore()

    return (
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
              Submitted by <span class="who">{existingLocation.created_by || "someone"}</span> {existingLocation.created_at.comment}
            </p>
          </Match>
        </Switch>
      </>
    )
  }

  return { render }
}
