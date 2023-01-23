//
// Photo viewer
//

import { createEffect } from 'solid-js'
import Logo from './Logo'
import MainStore from '../../main-store'

const url = config.routes.media + '/'

export default () => {
  const [store, { viewImage, viewNextImage, viewPrevImage }] = MainStore()

  let linkRefs = []

  const keydown = (event) => {
    let key = event.which

    switch (key) {
      case 37: // Left
        viewPrevImage()
        return
      case 39: // Right
        viewNextImage()
        return
      case 27: // Escape
      case 81: // Q
        viewImage()
        return
      case 68: // D
        let link = linkRefs[store.currentImage]

        // Briefly set the download file name
        link.download = "littermap-" + store.viewingImages[store.currentImage]

        // Activate the link
        link.click()

        // Reset the link back to a normal link
        link.download = ""
        return
      case 13: // Return
        linkRefs[store.currentImage].click()
        return
    }

    // Number keys select photos by index
    if (key >= 48 /* key 0 */ && key <= 57 /* key 9 */) {
      let idx = key - 49 // Let idx range -1, 0..8 for keys 0, 1..9

      // Key 0 (key index -1) is photo number 10 (array index 9)
      if (idx === -1)
        idx = 9

      if (idx < store.viewingImages.length)
        viewImage(idx)
    }
  }

  createEffect(
    () => {
      if (store.viewingImages) {
        document.addEventListener('keydown', keydown)
      } else {
        document.removeEventListener('keydown', keydown)
      }
    }
  )

  return (
    <Show when={store.viewingImages}>
      <div class="click-screen" onclick={() => viewImage()} />

      <div id="photo-viewer">
        <For each={store.viewingImages}>
          {(item, idx) => (
            <a href={url + store.viewingImages[idx()]}
              style={idx() === store.currentImage ? "visibility:visible" : "visibility:hidden"}
              target="_blank"
              ref={linkRefs[idx()]}>
              <img class="photo" src={url + store.viewingImages[idx()]} />
            </a>
          )}
        </For>
        <Logo />
        <p class="info">
          {store.currentImage + 1} of {store.viewingImages.length}
        </p>
        <Show when={store.viewingImages.length !== 0}>
          <button class="nav prev" onclick={viewPrevImage}>
            {"<"}
          </button>
          <button class="nav next" onclick={viewNextImage}>
            {">"}
          </button>
        </Show>
        <button class="close" onclick={() => viewImage()}>
          ×
        </button>
      </div>
    </Show>
  )
}
