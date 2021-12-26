//
// Photo viewer
//

import { createEffect } from 'solid-js'
import Logo from './Logo'
import MainStore from '../../main-store'

const url = config.backend.media + '/'

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
        link.download = "littermap-" + store.viewingImages[store.currentImage]
        link.click()
        link.download = ""
        return
      case 13: // Return
        linkRefs[store.currentImage].click()
        return
    }

    // Number keys select photos by index
    if (key >= 48 /* key 0 */ && key <= 57 /* key 9 */) {
      let idx = key - 49

      // Key 0 is photo number 10 (index 9)
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
