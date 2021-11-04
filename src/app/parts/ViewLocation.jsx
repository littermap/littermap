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
          <div>
            {store.viewingLocation.description}
          </div>
        </section>
        <section>
          <label>
            Litter level
          </label>
          <div>
            {store.viewingLocation.level}/100
          </div>
        </section>
        <section>
          <label>
            Photos
          </label>
          <Switch>
            <Match when={store.viewingLocation.images.length !== 0}>
              <div class="photos">
                <For each={store.viewingLocation.images}>
                  {(image, idx) => (
                    <img src={config.backend.media + "/" + image} />
                  )}
                </For>
              </div>
            </Match>
            <Match when={store.viewingLocation.images.length === 0}>
              No photos
            </Match>
          </Switch>
        </section>
        <p class="info">
          Submitted by {store.viewingLocation.created_by || "someone"} at {store.viewingLocation.created_at}
        </p>
      </Portal>
    </Show>
  )
}
