//
// Editable description field
//

import { createSignal, onMount } from 'solid-js'
import createEditable from '../editable-field'

export default createDescriptionField = ({ initialValue, pureEdit }) => {
  const [getInputValue, setInputValue] = createSignal(initialValue)
  const [getSavedValue, setSavedValue] = createSignal(initialValue)

  function saveFn() {
    // ... logic for saving on the backend

    setSavedValue(getInputValue())
  }

  function resetFn() {
    setInputValue(getSavedValue())
  }

  const RenderView = () => (
    <div>
      {getSavedValue()}
    </div>
  )

  const RenderEdit = () => {
    let textArea

    function setAutoHeight() {
      //
      // Assume we are using 'box-sizing:border-box' to make the entire element fit exactly into
      // the width of its parent container with 'width:100%'.
      //
      // However, this makes the border cut into the inner part, thereby impacting the calculation.
      //
      // So, add extra height for border (so the scroll bar doesn't appear when it shouldn't).
      //
      let border = textArea.offsetHeight - textArea.clientHeight + 1

      textArea.style.height = '0'
      textArea.style.height = textArea.scrollHeight + border + 'px'
    }

    function valueChanged() {
      setInputValue(this.value)
      setAutoHeight()
    }

    onMount(setAutoHeight)

    return (
      <textarea oninput={setAutoHeight} onchange={valueChanged} ref={textArea}>
        {getInputValue()}
      </textarea>
    )
  }

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
    getInputValue
  }
}
