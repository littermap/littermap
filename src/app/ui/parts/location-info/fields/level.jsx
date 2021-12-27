//
// Editable litter level field
//

import { createSignal } from 'solid-js'
import createEditableField from '../editable-field'

const litterLevels = [
  [1,   "You've got to be kidding"],
  [2,   "Trace amounts of litter"],
  [10,  "Human activity has been noted"],
  [20,  "Starting to look bad"],
  [30,  "Takes more than one person"],
  [40,  "Needs major attention"],
  [66,  "Knee deep in litter"],
  [75,  "Home prices are starting to plummet"],
  [90,  "Apocalyptic level"],
  [100, "Please be honest"]
]

export default createLevelField = ({ initialValue, allowedToEdit, pureEdit }) => {
  const [getInputValue, setInputValue] = createSignal(initialValue)
  const [getSavedValue, setSavedValue] = createSignal(initialValue)

  function saveFn() {
    // ... logic for saving on the backend

    setSavedValue(getInputValue())
  }

  function resetFn() {
    setInputValue(getSavedValue())
  }

  function isValid() {
    return getInputValue() < 100
  }

  function getCaption(level) {
    let caption

    for (let i = 0; i < litterLevels.length && litterLevels[i][0] <= level; i++)
      caption = litterLevels[i][1]

    return caption
  }

  const RenderView = () => (
    <div>
      {getSavedValue()}/100
    </div>
  )

  const RenderEdit = () => {
    function valueChanged(event) {
      setInputValue(+event.target.value)
    }

    return (
      <>
        <input type="range" min="1" max="100" value={getInputValue()} oninput={valueChanged} />
        <p class="info">
          {getCaption(getInputValue())}
        </p>
      </>
    )
  }

  const editable = createEditableField({
    title: "Litter level",
    RenderView,
    RenderEdit,
    pureEdit,
    resetFn,
    saveFn,
    isValid,
    allowedToEdit
  })

  return {
    render: editable.render,
    getInputValue,
    isValid
  }
}
