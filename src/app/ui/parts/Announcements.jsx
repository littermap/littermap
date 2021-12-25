//
// Closable announcements
//
// Shows announcements given in config.json on initial page load
//

import { createSignal } from 'solid-js'

export default () => {
  const [getItems, setItems] = createSignal(config.announcements)

  function close(event) {
    let items = [...getItems()]
    items.splice(event.target.dataset.index, 1)
    setItems(items)
  }

  return (
    <Show when={getItems().length !== 0}>
      <div id="announcements">
        <For each={getItems()}>
          {(item, idx) => (
            <div class="item">
              <p class="title">
                {item.title}
              </p>
              {/*The message itself is rendered as HTML, so make sure it's not malicious HTML */}
              <p class="message" innerHTML={item.message} />
              <button class="close" data-index={idx()} onclick={close}>
                ×
              </button>
            </div>
          )}
        </For>
      </div>
    </Show>
  )
}
