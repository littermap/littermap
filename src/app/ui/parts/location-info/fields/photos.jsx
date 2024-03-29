//
// Editable set of uploaded photos
//

import { createSignal } from 'solid-js'
import createFileUploader from '../file-uploader'
import createEditable from '../editable-field'
import MainStore from '../../../../main-store'

export default createPhotosField = ({ initialItems, allowedToEdit, pureEdit }) => {
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
                <img src={config.routes.media + '/' + image + '/80'} data-index={idx()} onclick={imageClicked} />
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
    saveFn,
    allowedToEdit
  })

  return {
    render: editable.render,
    isBusy: FileUploader.isBusy,
    getItems
  }
}
