//
// Editable description field
//

import { createSignal } from 'solid-js'
import createEditable from '../Editable'

export default createDescriptionField = ({ initialValue, pureEdit }) => {
  const [getValue, setValue] = createSignal(initialValue)
  const [getSavedValue, setSavedValue] = createSignal(initialValue)

  function valueChanged() {
    setValue(this.value)
  }

  function saveFn() {
    // ... save value on the backend

    setSavedValue(getValue())
  }

  function resetFn() {
    setValue(getSavedValue())
  }

  const RenderView = () => (
    <div>
      {getSavedValue()}
    </div>
  )

  const RenderEdit = () => (
    <textarea id="input-description" name="description" onchange={valueChanged}>{getValue()}</textarea>
  )

  const editable = createEditable({
    title: "What's going on at this location",
    RenderView,
    RenderEdit,
    pureEdit,
    resetFn,
    saveFn
  })

  return {
    render: editable.render,
    getValue
  }
}
