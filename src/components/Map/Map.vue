<script setup lang="ts">
import {onMounted} from 'vue'
import {initMap} from './model/initMap.ts'
import {addTestFeatures} from "./model/addFeatures/addTestFeatures.ts";
import FrameRateControl from '/src/components/Map/plugins/FrameRateControl'
import {addSupercluster} from "./model/addFeatures/addSupercluster.ts";

onMounted(async () => {
  const map = initMap()

  map.addControl(new FrameRateControl({}))

  map.on('load', () => {
    // addTestFeatures(map)
    addSupercluster(map)
  })
})
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>
#map { position: absolute; top: 0; bottom: 0; width: 100%; }
</style>
