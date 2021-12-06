import MainStore from '../store'

export default () => {
  const [store] = MainStore()

  return (
    <For each={store.editingNewLocations}>
      {item => (
        <Portal mount={document.getElementById('edit-new-location')}>
          <item.render />
        </Portal>
      )}
    </For>
  )
}
