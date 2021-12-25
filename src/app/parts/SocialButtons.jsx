//
// Social media buttons
//

import { createSignal } from 'solid-js'

export default () => {
  const [getOpen, setOpen] = createSignal(false)

  function hide() {
    setOpen(false)
  }

  function toggle() {
    setOpen(val => !val)
  }

  return (
    <>
      <Show when={getOpen()}>
        <div class="click-screen" onclick={hide} />
      </Show>

      <div id="social-menu">
        <div class={"buttons" + (getOpen() ? " open" : "")}>
          <For each={config.social.links}>
            {item => (
              <a href={item.link}>
                <button class="map-control">
                  <img class="icon" src={"/images/icons/font-awesome/" + item.icon + ".svg"} />
                </button>
              </a>
            )}
          </For>
        </div>

        <button class="map-control menu-toggle" onclick={toggle}>
          <img class="icon" src={"/images/icons/font-awesome/solid/users.svg"} />
        </button>
      </div>
    </>
  )
}
