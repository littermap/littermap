import { useStore } from '../store'

export default () => {
  const [store] = useStore()

  return (
    <Show when={store.viewingLocation}>
      <Portal mount={document.getElementById('view-location')}>
        <section>
          <label>
            What's going on at this location
          </label>
          <div class="value">
            {store.currentLocation.description}
          </div>
        </section>
        <section>
          <label>
            Litter level
          </label>
          <div class="value">
            {store.currentLocation.level}
          </div>
        </section>
        <p class="info">
          Submitted by {store.currentLocation.created_by || "someone"} at {store.currentLocation.created_at}
        </p>
      </Portal>
    </Show>
  )
}
