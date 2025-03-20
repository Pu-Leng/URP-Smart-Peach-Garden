<script setup>
import { defineOptions } from "vue"
import { onMounted } from 'vue'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer.js'
import Basemap from '@arcgis/core/Basemap.js'
import Map from "@arcgis/core/Map.js"
import SceneView from "@arcgis/core/views/SceneView.js"
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js"
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
import "@/../node_modules/@arcgis/core/assets/esri/themes/light/main.scss"
import GardenSearch from "@/components/GardenSearch.vue"


defineOptions({
  name: "ShowMap"
})

const initMap = () => {
  const tiandituLayer = new WebTileLayer({
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&l={level}&tk=a8733171696510bb7992943b38680be3',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
  })
  const tiandituLayer_POI = new WebTileLayer({
    urlTemplate:
      'http://{subDomain}.tianditu.gov.cn/DataServer?T=cva_w&x={col}&y={row}&l={level}&tk=a8733171696510bb7992943b38680be3',
    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
  })
  const basemap = new Basemap({
    baseLayers: [tiandituLayer, tiandituLayer_POI]
  })

  const map = new Map({
    basemap : basemap,
    ground: "world-elevation"
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
        // 117.11284,
        // 40.13634099,
        // 10000
        117.15544991047595,
        38.07472904883967,
        152773.9193789875
      ],
      tilt: 56.244597262215855,
      fov: 10,
      heading: 359.75402796994206,
      ui: {
        components: ["zoom", "compass"]
      }
    }
  })

  // const interval = setInterval(() => {
  //   console.log(mapView.camera.position)
  //   console.log(mapView.camera.tilt)
  //   console.log(mapView.camera.fov)
  //   console.log(mapView.camera.heading)
  // }, 20000);

  const boundary_layer = new WMSLayer({
    url: "http://124.70.45.66:8080/geoserver/pinggu_bound/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pinggu_bound%3Agardenpoly&maxFeatures=50&outputFormat=application%2Fjson"
  });
  map.add(boundary_layer);  // adds the layer to the map



  mapView.ui.remove("attribution");
  
  const toggle = new BasemapToggle({
    // Set properties
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
  <div id="map">
    <GardenSearch class="search"/>
  </div>
</template>

<style scoped>
#map {
  flex-grow:1;
  width: auto;
  position: relative
}
.search{
  position: absolute; /* 绝对定位 */
  top: 0;
  right: 0;
  /* width: 100px;
  height: 60px; */
  /* border: 1px solid red; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
/* 移除地图视图的边框 */
.esri-view {
  --esri-view-outline-color: unset !important;
  --esri-view-outline: unset !important;
  --esri-view-outline-offset: unset !important;
}
</style>