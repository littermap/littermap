//
// Reusable SVG icons
//
// Using "currentColor" allows styling using CSS color property
//

const NavigateGlyph = () => {
  return (
    <svg viewBox="-50 -50 100 100">
      <polygon
        fill="currentColor" transform="rotate(30)"
        points="-20,26 0,-28 20,26 0,16" />
    </svg>
  )
}

const LayersGlyph = () => {
  return (
    <svg viewBox="-50 -50 100 100">
      <g stroke="currentColor" stroke-width="3">
        <polygon points="-30,5 0,-10 30,5 0,20" fill="none" />
        <polygon points="-30,-10 0,-25 30,-10 0,5" fill="currentColor" />
      </g>
    </svg>
  )
}

const PencilGlyph = () => {
  return (
    <svg viewBox="-50 -50 100 100">
      <g fill="currentColor" transform="rotate(45)">
        <polygon points="0,30 -5,25 -5,-15 5,-15 5,25" />
        <rect x="-5" y="-30" width="10" height="10" />
      </g>
    </svg>
  )
}

export {
  NavigateGlyph,
  LayersGlyph,
  PencilGlyph
}
