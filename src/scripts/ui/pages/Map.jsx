import { createEffect, createSignal } from 'solid-js'
import { useStore } from '../../store'
import { toggleBaseLayer, geolocateMe, submitLocation, getNWandSE } from '../../map'
import HeatMapOverlay from '../HeatMapOverlay'
import AddressSearch from '../AddressSearch'
import getWeights from '../../predict'

export default () => {
  const [store, { hideMenu } ] = useStore()
  const [heatMapActive, setHeatMapActive] = createSignal(false);
  const [weightMatrix, setWeightMatrix] = createSignal(new Array(400));

  const toggleHeatMap = () => { 
    // gets coords
    let NWandSE = getNWandSE();
    //gets and set wieghts for heat map
    getWeights(NWandSE[0], NWandSE[1], NWandSE[2], NWandSE[3], 60).then((matrix) => {
      setWeightMatrix(matrix);
      console.log("weight matrix is", weightMatrix());
      setHeatMapActive(!heatMapActive());
    });
  };

  const suggestion = () => (
    store.showingStreetView
      ? "Take a closer look"
      : (
          (store.mapZoom < config.map.min_add_location_zoom ? "Zoom in" : "Tap and hold")
          + " to add a littered location"
        )
  )

  

  return (
    <>
      <Show when={!store.showingStreetView}>
        <AddressSearch />
        <button id="switch-layers" class="map-control" onclick={toggleBaseLayer}>
          ⿻
        </button>
        <Show when={navigator.geolocation}>
          <button id="geolocate" class="map-control" onclick={geolocateMe}>
            ⊚
          </button>
        </Show>
      </Show>
      <button id="heatmap-button" class="map-control" onclick={toggleHeatMap}>Toggle Heat Map</button>
      <Show when={heatMapActive()}>
        <HeatMapOverlay weightMatrix={weightMatrix()}/>
      </Show>
      <div id="hint">
        <p>
          {suggestion()}
        </p>
      </div>
    </>
  )
}
