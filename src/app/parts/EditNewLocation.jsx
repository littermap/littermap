import { createStore } from 'solid-js/store'
import { submitLocation } from '../map'
import agent from '../request-agent'
import Store from '../store'

const litterLevels = [
  [0,   "You've got to be kidding"],
  [10,  "Human activity has been noted"],
  [20,  "Starting to look bad"],
  [30,  "Takes more than one person"],
  [40,  "Needs major attention"],
  [66,  "Knee deep in litter"],
  [75,  "Home prices are plummeting"],
  [90,  "Apocalyptic level"],
  [100, "Please be honest"]
]

const defaults = {
  description: '',
  level: 10,
  photos: [],
  invalidLog: []
}

export default () => {
  const [store, { closeEditNewLocation }] = Store()

  const [state, setState] = createStore({
    ...defaults
  })

  //
  // Setting a nested value directly this way reliably triggers a reaction
  //
  function setValue(idx, property, value) {
    setState('photos', idx, property, value)
  }

  function descriptionChanged() {
    setState({ description: this.value })
  }

  function levelChanged(event) {
    setState({ level: +event.target.value })
  }

  function litterLevelCaption() {
    let caption

    for (let i = 0; i < litterLevels.length && litterLevels[i][0] <= state.level; i++) {
      caption = litterLevels[i][1]
    }

    return caption
  }

  function filesChanged() {
    let allowed = config.location.max_uploads - state.photos.length
    let files = [...this.files].slice(0, allowed)
    let newPhotos = []


    files.forEach(
      file => {
        let fileHash = makeHash(
          file.name + file.type + file.size + file.lastModified
        )

        // Check if it's already been added
        let idx = state.photos.findIndex(item => item.fileHash === fileHash)

        if (idx === -1) {
          let photo = {
            file,
            fileHash,
            status: "checking"
          }

          newPhotos.push(photo)

          processImage(photo)
        }
      }
    )

    setState({
      photos: [...state.photos, ...newPhotos],
      invalidLog: []
    })
  }

  function findPhoto(photo) {
    return state.photos.findIndex(item => item.file === photo.file)
  }

  function processImage(photo) {
    let image = new Image()

    image.onload = async () => {
      // Find the photo from scratch (in case it's been deleted)
      let idx = findPhoto(photo)

      if (idx !== -1) {
        setValue(idx, 'status', "preparing")
        setValue(idx, 'src', image.src)

        let {url, fields} = await fetchUploadLink()

        // Find the photo again (in case it's been deleted while fetching the upload link)
        idx = findPhoto(photo)

        if (idx === -1 )
          return

        if (!url || !fields) {
          console.info("Server didn't return an upload link")
          setValue(idx, 'status', "failed")
          return
        }

        setValue(idx, 'progress', 0)
        setValue(idx, 'status', "uploading")

        const formData = new FormData()
        formData.append("content-type", photo.file.type)

        Object.entries(fields).forEach(
          ([k, v]) => { formData.append(k, v) }
        )

        formData.append("file", photo.file)

        //
        // Since the fetch() API doesn't support upload progress tracking yet...
        //
        const request = new XMLHttpRequest()
        request.open('POST', url)

        request.upload.onprogress = (event) => {
          let total = event.lengthComputable ? event.total : photo.file.size

          setValue(idx, 'progress', Math.round(100 * event.loaded / total))
        }

        request.onerror = () => {
          console.error("Upload error")
          setValue(idx, 'status', "failed")
        }

        request.onload = () => {
          // Find the photo again (in case it's been deleted during the upload)
          idx = findPhoto(photo)

          if (idx !== -1) {
            if (request.status === 204) {
              setValue(idx, 'src', url + '/' + fields.key)
              setValue(idx, 'id', fields.id)
              setValue(idx, 'status', "uploaded")
            } else {
              console.error("Upload failed with status: " + request.status)
              setValue(idx, 'status', "failed")
            }
          }
        }

        // Attach the request object reference to the photo, to allow aborting the request
        setValue(idx, "uploadRequest", request)

        request.send(formData)
      } else
        URL.revokeObjectURL(image.src)
    }

    image.onerror = () => {
      let photos = [...state.photos]
      let idx = photos.findIndex(item => item.file === photo.file)

      if (idx !== -1) {
        setState({
          invalidLog: [...state.invalidLog, photo.file.name]
        })

        deletePhoto(idx)
      } else
        URL.revokeObjectURL(image.src)
    }

    image.src = URL.createObjectURL(photo.file)
  }

  function makeHash(str) {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }

    return hash
  }

  function freeObjectURL(photo) {
    if (photo.src)
      URL.revokeObjectURL(photo.src)
  }

  function freeImage(photo) {
    if (photo.status === "uploading" && photo.uploadRequest)
      photo.uploadRequest.abort()

    freeObjectURL(photo)
  }

  function freeImages() {
    state.photos.forEach(
      photo => { freeImage(photo) }
    )
  }

  function deletePhoto(idx) {
    // Copy the list of photos
    const photos = [...state.photos]

    // Remove the photo that is being deleted
    const [photo] = photos.splice(idx, 1)

    // Update the photo set
    setState({ photos })

    freeImage(photo)
  }

  function isProcessing() {
    for (let i = 0; i < state.photos.length; i++) {
      if (["checking", "preparing", "uploading"].includes(state.photos[i].status))
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

  function addPhotosClicked() {
    // Trigger a "click" action on the hidden file input element
    document.getElementById("select-images").click()
  }

  function reset() {
    freeImages()
    setState({ ...defaults })
  }

  function cancel() {
    closeEditNewLocation()
    reset()
  }

  function submit() {
    let details = {
      description: state.description,
      level: state.level,
      images: state.photos.map(photo => photo.id)
    }

    closeEditNewLocation()
    reset()

    submitLocation(details)
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
      <For each={state.photos}>
        {(photo, idx) => (
          <>
            <div>
              {photo.file.name} ({photo.status}) {(typeof photo.progress !== "undefined") ? photo.progress + "%" : ""}
            </div>
            <Show when={photo.status === "uploading"}>
              <progress max="100" value={photo.progress} />
            </Show>
          </>
        )}
      </For>
    </Show>
  )

  const EditPhotos = () => (
    <>
      <div class="photos">
        <For each={state.photos}>
          {(photo, idx) => (
            <Switch>
              <Match when={["preparing", "uploading", "uploaded", "failed"].includes(photo.status)}>
                <div class="preview">
                  <img class={photo.status} src={photo.src} onclick={photoClicked(idx())} />
                  <Show when={photo.status === "uploading"}>
                    <progress max="100" value={photo.progress} />
                  </Show>
                </div>
              </Match>
            </Switch>
          )}
        </For>
      </div>
      <Errors />
      <button disabled={state.photos.length >= config.location.max_uploads} onclick={addPhotosClicked}>
        Add photos
      </button>
      <DebugInfo />
      <input id="select-images" type="file" multiple accept="image/*" onchange={filesChanged} style="display:none" />
    </>
  )

  return (
    <Show when={store.editingNewLocation}>
      <Portal mount={document.getElementById('edit-new-location')}>
        <section>
          <label for="input-description">
            What's going on at this location
          </label>
          <textarea id="input-description" name="description" onchange={descriptionChanged} />
        </section>
        <section>
          <label for="input-litter-level">
            Litter level
          </label>
          <input type="range" id="input-litter-level" name="level" min="1" max="100" value={state.level} oninput={levelChanged} />
          <p class="info">
            {litterLevelCaption()}
          </p>
        </section>
        <section>
          <label>
            Photos
          </label>
          <EditPhotos />
        </section>
        <section class="buttons">
          <button onclick={cancel}>
            Cancel
          </button>
          <button onclick={submit} disabled={isProcessing()}>
            Submit
          </button>
        </section>
        <Show when={store.profile}>
          <p class="info">
            You are logged in as {store.profile.name}
          </p>
        </Show>
      </Portal>
    </Show>
  )
}
