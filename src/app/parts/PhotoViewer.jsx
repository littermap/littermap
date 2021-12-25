//
// Photo viewer
//

import Logo from '../elements/Logo'
import MainStore from '../store'

const url = config.backend.media + '/'

export default () => {
  const [store, { viewImage, viewNextImage, viewPrevImage }] = MainStore()

  return (
    <Show when={store.viewingImages}>
      <div class="click-screen" onclick={() => viewImage()} />

      <div id="photo-viewer">
        <a href={url + store.viewingImages[store.currentImage]} target="_blank">
          <img class="photo" src={url + store.viewingImages[store.currentImage]} />
        </a>
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
