<script setup>
import { defineOptions } from "vue"
import { onMounted } from 'vue'
import Map from "@arcgis/core/Map.js"
import SceneView from "@arcgis/core/views/SceneView.js"
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js"
import "@/../node_modules/@arcgis/core/assets/esri/themes/light/main.scss"


defineOptions({
  name: "ShowMap"
})

const initMap = () => {
  const map = new Map({
    basemap: 'topo-vector'
  })
  const mapView = new SceneView({
    map: map,
    container: "map",
    zoom: 18,
    camera: {
      position: [
        // 116.32135656930576,
        // 40.02258815860359,
        // 2000
        // 110.040315,
        // 27.578926,
        // 3000
        117.11284,
        40.13634099,
        10000
      ],
      tilt: 60.501473874885505,
      fov: 10,
      heading: 129.6038623691882,
      ui: {
        components: ["zoom", "compass"]
      }
    }
  })

  mapView.ui.remove("attribution");
  
  const toggle = new BasemapToggle({
    // 2 - Set properties
    view: mapView, // view that provides access to the map's 'topo-vector' basemap
    nextBasemap: "satellite", // allows for toggling to the 'hybrid' basemap
  })
  // Add widget to the top right corner of the view
  mapView.ui.add(toggle, "bottom-right")

}



onMounted(() => {
  initMap()
})


</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  flex-grow:1;
  width: auto
}
</style>