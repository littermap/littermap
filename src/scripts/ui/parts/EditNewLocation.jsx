import { createSignal } from 'solid-js'
import { useStore } from '../store'

export default () => {
  const [store, {hideEditNewLocation}] = useStore()

  const [getDescription, setDescription] = createSignal('')
  const [getLevel, setLevel] = createSignal(1)

  const descriptionChanged = (event) => {
    setDescription(event.target.value)
  }

  const levelChanged = (event) => {
    setLevel(+event.target.value)
  }

  const submit = (event) => {
    hideEditNewLocation()

    window.submitLocation({
      description: getDescription(),
      level: getLevel()
    })
  }

  return (
    <Show when={store.editingNewLocation}>
      <Portal mount={document.getElementById('edit-new-location')}>
        <section>
          <label>
            What's going on at this location
            <textarea name="description" onchange={descriptionChanged} />
          </label>
        </section>
        <section>
          <label for="input-litter-level">
            Litter level
          </label>
          <input type="range" id="input-litter-level" name="level" min="1" max="100" value="1"  onchange={levelChanged} />
        </section>
        <div class="buttons">
          <button onclick={hideEditNewLocation}>
            Cancel
          </button>
          <button onclick={submit}>
            Submit
          </button>
        </div>
        <Show when={store.profile}>
          <p class="info">You are logged in as {store.profile.name}</p>
        </Show>
      </Portal>
    </Show>
  )
}
