//
// An editable location field
//

import { createSignal } from 'solid-js'

export default createEditable = ({ title, RenderValue, RenderInput, pureEdit, resetFn, saveFn }) => {
  const [getState, setState] = createSignal(pureEdit ? "editing" : "viewing")

  function editClicked() {
    setState("editing")
  }

  function cancelClicked() {
    setState("viewing")
    resetFn()
  }

  function saveClicked() {
    setState("saving")
    saveFn()

    console.info("implement: save value to server")
    // ... send save to server
    // ... success or error

    setState("viewing")
  }

  const render = () => (
    <section>
      <label>
        {title}
        <Show when={getState() === "viewing"}>
          <button class="edit" onclick={editClicked}>
            edit
          </button>
        </Show>
      </label>
      <Switch>
        <Match when={getState() !== "viewing"}>
          <RenderInput />
          <Show when={!pureEdit}>
            <div>
              <button onclick={saveClicked} disabled={getState() === "saving"}>
                {getState() === "saving" ? "Saving..." : "Save"}
              </button>
              <button onclick={cancelClicked} disabled={getState() === "saving"}>
                Cancel
              </button>
            </div>
          </Show>
        </Match>
        <Match when={getState() === "viewing"}>
          <div>
            <RenderValue />
          </div>
        </Match>
      </Switch>
    </section>
  )

  return { render }
}
