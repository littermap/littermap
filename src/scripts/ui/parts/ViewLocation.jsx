import Store from '../store'

export default () => {
  const [store] = Store()

  return (
    <Show when={store.viewingLocation}>
      <Portal mount={document.getElementById('view-location')}>
        <section>
          <label>
            What's going on at this location
          </label>
          <div class="value">
            {store.viewingLocation.description}
          </div>
        </section>
        <section>
          <label>
            Litter level
          </label>
          <div class="value">
            {store.viewingLocation.level}
          </div>
        </section>
        <p class="info">
          Submitted by {store.viewingLocation.created_by || "someone"} at {store.viewingLocation.created_at}
        </p>
      </Portal>
    </Show>
  )
}
