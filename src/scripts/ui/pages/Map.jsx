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
    let NWandSE = getNWandSE();
    heatMapActive() ? setHeatMapActive(false) : getWeights(NWandSE[0], NWandSE[1], NWandSE[2], NWandSE[3], 60).then((matrix) => {setWeightMatrix(matrix); setHeatMapActive(true);}); 
  };

  const suggestion = () => (
    store.showingStreetView
      ? "Take a closer look"
      : (
          (store.mapZoom < config.map.min_add_location_zoom ? "Zoom in" : "Tap and hold")
          + " to add a littered location"
        )
  )

  const heatmapText = () => (
    store.showingStreetView
      ? "Take a closer look"
      : (
          (store.mapZoom < 14 ? "Zoom in" : "Click")
          + " to toggle Heat Map"
        )
  )

  const checkIfShouldBeDisabled = () => {
    store.mapZoom < 14 ? "disabled" : ""
  }

  console.log(store.mapZoom)
  
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
        <button id="heatmap-button" onclick={toggleHeatMap} {...checkIfShouldBeDisabled}>{heatmapText}</button>
        <Show when={heatMapActive()}>
          <HeatMapOverlay weightMatrix={weightMatrix()}/>
        </Show>
      </Show>
      
      <div id="hint">
        <p>
          {suggestion()}
        </p>
      </div>
    </>
  )
}
