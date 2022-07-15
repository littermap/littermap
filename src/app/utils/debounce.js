//
// Function debouncing
//
// Strategically limit the frequency of execution of an event handler during rapid firing sessions
//

//
// Create a wrapper around a function which will only execute the original function at planned intervals
// during a quick succession of calls of the wrapper function.
//
function debounce(func, intermittent, final) {
  let debouncing = false
  let scheduled
  let regularTimer
  let finalTimer

  //
  // Every time this function is called, it postpones the final func() call until "final" milliseconds
  // into the future. However, it also schedules func() to be called on the very next invocation after
  // every "intermittent" milliseconds during the debouncing operation and until the final func() call
  // has occurred.
  //
  function debouncedFunction() {
    if (!debouncing) {
      debouncing = true
      scheduled = false

      // Set up intermittent func() calls (assuming the trigger keeps being fired)
      regularTimer = setInterval(
        () => { scheduled = true },
        intermittent
      )
    } else if (scheduled) {
      scheduled = false

      func()
    }

    // Cancel previous postponement of final func() call
    clearTimeout(finalTimer)

    // Postpone final func() call for "final" milliseconds
    finalTimer = setTimeout(
      () => {
        debouncing = false

        clearTimeout(regularTimer)

        // Final call
        func()
      },
      final
    )
  }

  // Return the debounced wrapper for the "func" function
  return debouncedFunction
}

export {
  debounce
}
