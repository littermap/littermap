//
// File uploader
//
// Only supports images (but could be extended to other file types)
//

import { createStore } from 'solid-js/store'
import agent from '../../../requests'

const defaults = {
  items: [],
  invalidLog: [],
  tooManyWarning: false
}

export default createFileUploader = ({maxFiles = -1, maxFileSize = -1, existingItems} = {}) => {
  let hiddenFileInput

  const [state, setState] = createStore({
    ...defaults
  })

  setExistingItems(existingItems)

  function setItemValue(idx, property, value) {
    // Set an item property such that it triggers a user interface update
    setState('items', idx, property, value)
  }

  function findItem(fileHash) {
    return state.items.findIndex(
      item => item.fileHash === fileHash
    )
  }

  function filesSelected() {
    let files = [...this.files]

    if (maxFiles > -1) {
      let allowed = maxFiles - state.items.length

      if (files.length > allowed)
        setState('tooManyWarning', true)

      files = files.slice(0, allowed)
    }

    let newItems = []

    files.forEach(
      file => {
        // Use available information to create a distinctive hash to identify this file
        let fileHash = makeHash(
          file.name + file.type + file.size + file.lastModified
        )

        let idx = findItem(fileHash)

        // Check if it's already been added
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

  function processImage(item) {
    let image = new Image()

    image.onload = uploadItem(item)

    image.onerror = () => {
      let idx = findItem(item.fileHash)

      if (idx !== -1) {
        setState({
          invalidLog: [...state.invalidLog, item.file.name]
        })

        deleteItem(idx)
      } else
        URL.revokeObjectURL(image.src)
    }

    item.src = image.src = URL.createObjectURL(item.file)
  }

  function uploadItem(item) {
    return async () => {
      // Find the item from scratch (in case the item list has changed or it's been deleted)
      let idx = findItem(item.fileHash)

      if (idx !== -1) {
        if (maxFileSize !== -1 && item.file.size > maxFileSize) {
          item.error = "is " + sizeInMB(item.file.size) + ", the maximum is " + sizeInMB(maxFileSize)
          setItemValue(idx, 'status', "failed")

          return
        }

        item.progress = 0
        setItemValue(idx, 'status', "preparing")

        let url, fields

        //
        // Get a signed upload URL with a limited expiration date
        //
        try {
          ({url, fields} = await fetchUploadLink())
        } catch(e) {
          console.info("Upload link fetch error:", e.message) // For debugging
        }

        // Find the item again (in case the item list changed while fetching the upload link)
        idx = findItem(item.fileHash)

        if (idx === -1)
          return

        if (!url || !fields) {
          console.info("Server didn't return an upload link")

          item.error = "failed to upload: server didn't return an upload link"
          setItemValue(idx, 'status', "failed")
          return
        }

        setItemValue(idx, 'status', "uploading")

        const formData = new FormData()

        formData.append("content-type", item.file.type)

        Object.entries(fields).forEach(
          ([k, v]) => { formData.append(k, v) }
        )

        // The file must be the last field in the form data
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
          item.error = "encountered an upload error"
          setItemValue(idx, 'status', "failed")
        }

        request.onload = () => {
          // Find the item again (in case the item list changed during the upload)
          idx = findItem(item.fileHash)

          if (idx !== -1) {
            if (request.status === 204 || request.status === 201) {
              item.src = url + '/' + fields.key
              item.id = fields.id
              setItemValue(idx, 'status', "uploaded")
            } else {
              console.info("Upload failed with status:", request.status)

              item.error = 'encountered an upload error'
              setItemValue(idx, 'status', "failed")
            }
          }
        }

        // Attach the request object reference to the item, to allow aborting the request
        item.uploadRequest = request

        request.send(formData)
      } else {
        URL.revokeObjectURL(image.src)
      }
    }
  }

  function sizeInMB(bytes) {
    return (bytes / 1000000).toFixed(1) + " MB"
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
    if (item.status === "uploading" && item.uploadRequest) {
      console.info("Upload request aborted:", item.file.name)
      item.uploadRequest.abort()
    }

    freeObjectURL(item)
  }

  function freeItems() {
    state.items.forEach(
      item => { freeItem(item) }
    )
  }

  function deleteItem(idx) {
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

  function itemClicked(idx) {
    return () => {
      setState({ invalidLog: [], tooManyWarning: false })
      deleteItem(idx)
    }
  }

  function selectFiles() {
    hiddenFileInput.click()
  }

  function reset(existingItems) {
    freeItems()
    setState({ ...defaults })
    setExistingItems(existingItems)
  }

  function setExistingItems(existingItems) {
    if (!existingItems)
      return

    let items = []

    existingItems.forEach(
      item => {
        items.push({
          id: item,
          src: config.routes.media + '/' + item,
          status: "existing"
        })
      }
    )

    setState({ items })
  }

  const Errors = () => (
    <>
      <For each={state.invalidLog}>
        {(item, idx) => (
          <p class="error">
            {item} is not a valid or allowed image format
          </p>
        )}
      </For>
      <For each={state.items}>
        {(item, idx) => (
          <Show when={item.error}>
            <p class="error">
              {item.file.name} {item.error}
            </p>
          </Show>
        )}
      </For>
      <Show when={state.tooManyWarning}>
        <p class="error">
          A maximum of {maxFiles} files is allowed
        </p>
      </Show>
    </>
  )

  const DebugInfo = () => (
    <Show when={config.debug.upload_info}>
      <For each={state.items}>
        {(item, idx) => (
          <Show when={item.status !== "existing"}>
            <div>
              {item.file.name} ({item.status}) {(typeof item.progress !== "undefined") ? item.progress + "%" : ""}
            </div>
            <Show when={item.status === "uploading"}>
              <progress max="100" value={item.progress} />
            </Show>
          </Show>
        )}
      </For>
    </Show>
  )

  const FileUploader = () => (
    <>
      <div class="photos">
        <For each={state.items}>
          {(item, idx) => (
            <Show when={["existing", "preparing", "uploading", "uploaded", "failed"].includes(item.status)}>
              <div class={"preview " + item.status}>
                <img class={item.status} src={item.src} onclick={itemClicked(idx())} />
                <Show when={["preparing", "uploading"].includes(item.status)}>
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
      <input ref={hiddenFileInput} type="file" multiple accept="image/*" onchange={filesSelected} style="display:none" />
    </>
  )

  return {
    render: FileUploader,
    getItems: () => state.items,
    isBusy,
    reset
  }
}
