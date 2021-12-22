//
// Map control buttons
//

import { toggleBaseLayer, geolocateMe } from '../map'
import { LayersGlyph, NavigateGlyph } from '../elements/glyphs'

export default () => {
  return (
    <div id="map-buttons">
      <Show when={navigator.geolocation}>
        <button class="map-control" id="geolocate" onclick={geolocateMe}>
          <NavigateGlyph />
        </button>
      </Show>
      <button class="map-control" id="switch-layers" onclick={toggleBaseLayer}>
        <LayersGlyph />
      </button>
    </div>
  )
}
