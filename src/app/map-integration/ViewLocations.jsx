import MainStore from '../store'

export default () => {
  const [store] = MainStore()

  return (
    <For each={store.viewingLocations}>
      {item => (
        <Portal mount={document.getElementById('view-location')}>
          <item.render />
        </Portal>
      )}
    </For>
  )
}
