//
// An editable location field
//

import { createSignal } from 'solid-js'
import { PencilGlyph } from '../../../elements/glyphs'

export default createEditable = ({ title, RenderView, RenderEdit, pureEdit, resetFn, saveFn, isValid }) => {
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

  const render = (props) => (
    <section>
      <label>
        {title}
        <Show when={getState() === "viewing"}>
          <button class="edit" onclick={editClicked}>
            <PencilGlyph />
          </button>
        </Show>
      </label>
      <Switch>
        <Match when={getState() !== "viewing"}>
          <RenderEdit />
          <Show when={!pureEdit}>
            <div class="buttons">
              <button onclick={saveClicked} disabled={getState() === "saving" || (isValid && !isValid())}>
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
            <RenderView />
          </div>
        </Match>
      </Switch>
    </section>
  )

  return { render }
}
