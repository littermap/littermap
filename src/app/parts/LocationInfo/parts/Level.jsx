//
// Editable litter level field
//

import { createSignal } from 'solid-js'
import createEditable from './Editable'

const litterLevels = [
  [1,   "You've got to be kidding"],
  [2,   "Trace amounts of litter"],
  [10,  "Human activity has been noted"],
  [20,  "Starting to look bad"],
  [30,  "Takes more than one person"],
  [40,  "Needs major attention"],
  [66,  "Knee deep in litter"],
  [75,  "Home prices are plummeting"],
  [90,  "Apocalyptic level"],
  [100, "Please be honest"]
]

export default createLevelField = ({ initialValue, pureEdit }) => {
  const [getValue, setValue] = createSignal(initialValue)
  const [getSavedValue, setSavedValue] = createSignal(initialValue)

  function valueChanged(event) {
    setValue(+event.target.value)
  }

  function saveFn() {
    // ... save value on the backend

    setSavedValue(getValue())
  }

  function resetFn() {
    setValue(getSavedValue())
  }

  function getCaption(level) {
    let caption

    for (let i = 0; i < litterLevels.length && litterLevels[i][0] <= level; i++)
      caption = litterLevels[i][1]

    return caption
  }

  const RenderValue = () => (
    <div>
      {getSavedValue()}/100
    </div>
  )

  const RenderInput = () => (
    <>
      <input type="range" name="level" min="1" max="100" value={getValue()} oninput={valueChanged} />
      <p class="info">
        {getCaption(getValue())}
      </p>
    </>
  )

  const editable = createEditable({
    title: "Litter level",
    RenderValue,
    RenderInput,
    pureEdit,
    resetFn,
    saveFn
  })

  return {
    render: editable.render,
    getValue
  }
}
