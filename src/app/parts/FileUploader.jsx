//
// File uploader (currently only images)
//

import { createStore } from 'solid-js/store'
import agent from '../request-agent'

const defaults = {
  items: [],
  invalidLog: []
}

export const createFileUploader = () => {
  let hiddenFileInput

  const [state, setState] = createStore({
    ...defaults
  })

  function setItemValue(idx, property, value) {
    // Setting a nested value directly this way reliably triggers updates
    setState('items', idx, property, value)
  }

  function filesChanged() {
    let allowed = config.location.max_uploads - state.items.length
    let files = [...this.files].slice(0, allowed)
    let newItems = []

    files.forEach(
      file => {
        let fileHash = makeHash(
          file.name + file.type + file.size + file.lastModified
        )

        // Check if it's already been added
        let idx = state.items.findIndex(item => item.fileHash === fileHash)

        if (idx === -1) {
          let item = {
            file,
            fileHash,
            status: "checking"
          }

          newItems.push(item)

          processImage(item)
        }
      }
    )

    setState({
      items: [...state.items, ...newItems],
      invalidLog: []
    })
  }

  function findItem(item) {
    return state.items.findIndex(
      candidate => candidate.fileHash === item.fileHash
    )
  }

  function processImage(item) {
    let image = new Image()

    image.onload = uploadItem(item)

    image.onerror = () => {
      let items = [...state.items]
      let idx = items.findIndex(item => item.file === item.file)

      if (idx !== -1) {
        setState({
          invalidLog: [...state.invalidLog, item.file.name]
        })

        deletePhoto(idx)
      } else
        URL.revokeObjectURL(image.src)
    }

    item.src = image.src = URL.createObjectURL(item.file)
  }

  function uploadItem(item) {
    return async () => {
      // Find the item from scratch (in case the item list has changed or it's been deleted)
      let idx = findItem(item)

      if (idx !== -1) {
        setItemValue(idx, 'status', "preparing")

        let {url, fields} = await fetchUploadLink()

        // Find the item again (in case the item list changed while fetching the upload link)
        idx = findItem(item)

        if (idx === -1)
          return

        if (!url || !fields) {
          console.info("Server didn't return an upload link")
          setItemValue(idx, 'status', "failed")
          return
        }

        setItemValue(idx, 'progress', 0)
        setItemValue(idx, 'status', "uploading")

        const formData = new FormData()
        formData.append("content-type", item.file.type)

        Object.entries(fields).forEach(
          ([k, v]) => { formData.append(k, v) }
        )

        formData.append("file", item.file)

        //
        // Since the fetch() API doesn't support upload progress tracking yet...
        //
        const request = new XMLHttpRequest()
        request.open('POST', url)

        request.upload.onprogress = (event) => {
          let total = event.lengthComputable ? event.total : item.file.size

          setItemValue(idx, 'progress', Math.round(100 * event.loaded / total))
        }

        request.onerror = () => {
          console.error("Upload error")
          setItemValue(idx, 'status', "failed")
        }

        request.onload = () => {
          // Find the item again (in case the item list changed during the upload)
          idx = findItem(item)

          if (idx !== -1) {
            if (request.status === 204) {
              setItemValue(idx, 'src', url + '/' + fields.key)
              setItemValue(idx, 'id', fields.id)
              setItemValue(idx, 'status', "uploaded")
            } else {
              console.error("Upload failed with status: " + request.status)
              setItemValue(idx, 'status', "failed")
            }
          }
        }

        // Attach the request object reference to the item, to allow aborting the request
        setItemValue(idx, "uploadRequest", request)

        request.send(formData)
      } else {
        URL.revokeObjectURL(image.src)
      }
    }
  }

  function makeHash(str) {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }

    return hash
  }

  function freeObjectURL(item) {
    if (item.src)
      URL.revokeObjectURL(item.src)
  }

  function freeItem(item) {
    if (item.status === "uploading" && item.uploadRequest)
      item.uploadRequest.abort()

    freeObjectURL(item)
  }

  function freeItems() {
    state.items.forEach(
      item => { freeItem(item) }
    )
  }

  function deletePhoto(idx) {
    // Copy the list of items
    const items = [...state.items]

    // Remove the item that is being deleted
    const [item] = items.splice(idx, 1)

    // Update the item set
    setState({ items })

    freeItem(item)
  }

  function isBusy() {
    for (let i = 0; i < state.items.length; i++) {
      if (["checking", "preparing", "uploading"].includes(state.items[i].status))
        return true
    }

    return false
  }

  async function fetchUploadLink() {
    return await agent.uploads.getUploadLink()
  }

  function photoClicked(idx) {
    return () => {
      setState({ invalidLog: [] })
      deletePhoto(idx)
    }
  }

  function selectFiles() {
    hiddenFileInput.click()
  }

  function reset() {
    freeItems()
    setState({ ...defaults })
  }

  const Errors = () => (
    <For each={state.invalidLog}>
      {(item, idx) => (
        <p class="error">
          {item} is not a valid image file
        </p>
      )}
    </For>
  )

  const DebugInfo = () => (
    <Show when={config.debug.upload_info}>
      <For each={state.items}>
        {(item, idx) => (
          <>
            <div>
              {item.file.name} ({item.status}) {(typeof item.progress !== "undefined") ? item.progress + "%" : ""}
            </div>
            <Show when={item.status === "uploading"}>
              <progress max="100" value={item.progress} />
            </Show>
          </>
        )}
      </For>
    </Show>
  )

  const FileUploader = () => (
    <>
      <div class="photos">
        <For each={state.items}>
          {(item, idx) => (
            <Show when={["preparing", "uploading", "uploaded", "failed"].includes(item.status)}>
              <div class="preview">
                <img class={item.status} src={item.src} onclick={photoClicked(idx())} />
                <Show when={item.status === "uploading"}>
                  <progress max="100" value={item.progress} />
                </Show>
              </div>
            </Show>
          )}
        </For>
      </div>
      <Errors />
      <button disabled={state.items.length >= config.location.max_uploads} onclick={selectFiles}>
        Add photos
      </button>
      <DebugInfo />
      <input ref={hiddenFileInput} type="file" multiple accept="image/*" onchange={filesChanged} style="display:none" />
    </>
  )

  return { state, reset, isBusy, render: FileUploader }
}
