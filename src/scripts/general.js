//
// Detect touch support
//
let touchsupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

if (!touchsupport)
  document.documentElement.className += " non-touch"
