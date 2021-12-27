//
// An editable location field
//

import { onMount, onCleanup } from 'solid-js'
import { createSignal } from 'solid-js'
import { PencilGlyph } from '../../elements/glyphs'
import MainStore from '../../../main-store'

export default createEditable = (
  { title, RenderView, RenderEdit, pureEdit, resetFn, saveFn, isValid, allowedToEdit }
) => {
  // States: viewing, editing, saving
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

  const render = () => {
    const [store] = MainStore()

    function keydown(event) {
      if (event.which === 27) {
        if (!pureEdit && getState() === "editing") {
          event.preventDefault()
          cancelClicked()
        }
      }
    }

    onMount(
      () => {
        document.addEventListener('keydown', keydown)
      }
    )

    onCleanup(
      () => {
        document.removeEventListener('keydown', keydown)
      }
    )

    return (
      <section>
        <label>
          {title}
          <Show when={getState() === "viewing" && allowedToEdit(store.profile)}>
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
                <button onclick={saveClicked} disabled={getState() === "saving" || (isValid && !isValid()) || !allowedToEdit(store.profile)}>
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
  }

  return { render }
}
