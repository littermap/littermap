import { createStore } from 'solid-js/store'
import { submitLocation } from '../map'
import { createFileUploader } from './FileUploader'
import Store from '../store'

const litterLevels = [
  [1,   "You've got to be kidding"],
  [2,   "Trace amounts of litter"],
  [10,  "Human activity has been noted"],
  [20,  "Starting to look bad"],
  [30,  "Takes more than one person"],
  [40,  "Needs major attention"],
  [66,  "Knee deep in litter"],
  [75,  "Home prices are plummeting"],
  [90,  "Apocalyptic level"],
  [100, "Please be honest"]
]

const defaults = {
  description: '',
  level: 10
}

export default () => {
  const [store, { closeEditNewLocation }] = Store()

  const [state, setState] = createStore({
    ...defaults
  })

  const fileUploader = createFileUploader()

  function descriptionChanged() {
    setState({ description: this.value })
  }

  function levelChanged(event) {
    setState({ level: +event.target.value })
  }

  function litterLevelCaption() {
    let caption

    for (let i = 0; i < litterLevels.length && litterLevels[i][0] <= state.level; i++)
      caption = litterLevels[i][1]

    return caption
  }

  function reset() {
    setState({ ...defaults })
    fileUploader.reset()
  }

  function cancel() {
    closeEditNewLocation()
    reset()
  }

  function submit() {
    let details = {
      description: state.description,
      level: state.level,
      images: fileUploader.state.items.map(item => item.id)
    }

    closeEditNewLocation()
    reset()

    submitLocation(details)
  }

  return (
    <Show when={store.editingNewLocation}>
      <Portal mount={document.getElementById('edit-new-location')}>
        <section>
          <label for="input-description">
            What's going on at this location
          </label>
          <textarea id="input-description" name="description" onchange={descriptionChanged} />
        </section>
        <section>
          <label for="input-litter-level">
            Litter level
          </label>
          <input type="range" id="input-litter-level" name="level" min="1" max="100" value={state.level} oninput={levelChanged} />
          <p class="info">
            {litterLevelCaption()}
          </p>
        </section>
        <section>
          <label>
            Photos
          </label>
          <fileUploader.render />
        </section>
        <section class="buttons">
          <button onclick={cancel}>
            Cancel
          </button>
          <button onclick={submit} disabled={fileUploader.isBusy()}>
            Submit
          </button>
        </section>
        <Show when={store.profile}>
          <p class="info">
            You are logged in as {store.profile.name}
          </p>
        </Show>
      </Portal>
    </Show>
  )
}
