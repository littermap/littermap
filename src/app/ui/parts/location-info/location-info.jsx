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
  function allowedToEdit(profile) {
    if (existingLocation) {
      return config.debug.role === "admin" || (profile && existingLocation.created_by &&  profile.id === existingLocation.created_by.id)
    } else {
      return !!profile
    }
  }

  const description = createDescription({
    initialValue: !existingLocation ? defaults.description : existingLocation.description,
    allowedToEdit,
    pureEdit: !existingLocation
  })

  const level = createLevel({
    initialValue: !existingLocation ? defaults.level : existingLocation.level,
    allowedToEdit,
    pureEdit: !existingLocation
  })

  const photos = createPhotos({
    initialItems: !existingLocation ? [] : existingLocation.images,
    allowedToEdit,
    pureEdit: !existingLocation
  })

  const render = () => {
    let [store, { closeEditNewLocation }] = MainStore()

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

    return (
      <>
        <description.render />
        <level.render />
        <photos.render />

        <Show when={!existingLocation}>
          <section class="buttons">
            <button onclick={submit} disabled={!allowedToEdit(store.profile) || photos.isBusy() || !level.isValid()}>
              Submit
            </button>
            <button onclick={cancel}>
              Cancel
            </button>
          </section>
        </Show>

        <Switch>
          <Match when={!existingLocation}>
            <p class="info">
              {store.profile ? `You are logged in as ${store.profile.name}` : "You are not logged in"}
            </p>
          </Match>
          <Match when={existingLocation}>
            <p class="info">
              Submitted by <span class="who">{existingLocation.created_by.name || "someone"}</span> {existingLocation.created_at.comment}
            </p>
          </Match>
        </Switch>
      </>
    )
  }

  return { render }
}
