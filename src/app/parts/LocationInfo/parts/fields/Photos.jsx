//
// Editable set of uploaded photos
//

import { createSignal } from 'solid-js'
import createFileUploader from '../../elements/FileUploader'
import createEditable from '../Editable'
import MainStore from '../../../../store'

export default createPhotosField = ({ initialItems, pureEdit }) => {
  const [getSavedItems, setSavedItems] = createSignal(initialItems)

  const FileUploader = createFileUploader({
    maxFiles: config.location.max_uploads,
    maxFileSize: config.location.max_file_size,
    existingItems: initialItems
  })

  function getItems() {
    return FileUploader.getItems().map(item => item.id)
  }

  function saveFn() {
    // ... logic for saving on the backend

    setSavedItems(getItems())
  }

  function resetFn() {
    FileUploader.reset(getSavedItems())
  }

  const RenderView = () => {
    const [store, { viewImage }] = MainStore()

    function imageClicked(event) {
      viewImage({
        images: getSavedItems(),
        idx: +event.target.dataset.index
      })
    }

    return (
      <Switch>
        <Match when={getSavedItems().length !== 0}>
          <div class="photos">
            <For each={getSavedItems()}>
              {(image, idx) => (
                <img src={config.backend.media + '/' + image} data-index={idx()} onclick={imageClicked} />
              )}
            </For>
          </div>
        </Match>
        <Match when={getSavedItems().length === 0}>
          <div>
            No photos
          </div>
        </Match>
      </Switch>
    )
  }

  const RenderEdit = () => (
    <FileUploader.render />
  )

  const editable = createEditable({
    title: "Photos",
    RenderView,
    RenderEdit,
    pureEdit,
    resetFn,
    saveFn
  })

  return {
    render: editable.render,
    isBusy: FileUploader.isBusy,
    getItems
  }
}
