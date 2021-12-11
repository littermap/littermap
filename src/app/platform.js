//
// This runs once on page load and detects platform features
//

// Detect touch support
let touchsupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

// If touch support is not detected, tag the <html> element so styles can respond
if (!touchsupport)
  document.documentElement.classList.add("non-touch")
