//
// Debugging information (only shown when 'development' is 'true')
//
// Displays configuration settings at build time
//

import { createSignal } from 'solid-js'

export default () => {
  if (!config.development)
    return undefined

  const [getShow, setShow] = createSignal(true)

  return (
    <Show when={getShow()}>
      <div id="debug">
        <h1 onclick={() => setShow(false)}>
          Development build
        </h1>
        {Object.keys(config.debug).map(key => {
          let val = config.debug[key]

          switch (key) {
            case "upload_info":
              // Don't display if feature is turned off
              if (!val)
                return undefined

              break

            case "role":
              // Don't display if not a valid value
              if (!["admin"].includes(val))
                return undefined
          }

          return (
            <p>{key}: {config.debug[key].toString()}</p>
          )
        })}
      </div>
    </Show>
  )
}
