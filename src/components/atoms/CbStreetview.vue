<template>
  <!-- A small map preview of where the data is stored. Leaflet with
       OpenStreetMap tiles is free to use and needs no account or API key. -->
  <div
    v-ripple
    class="cb-hover relative h-18 w-54 cursor-pointer overflow-hidden rounded-2xl"
    @click="$emit('click')"
  >
    <!-- isolate keeps Leaflet's own stacked layers below the label. -->
    <div ref="mapContainer" class="isolate size-full"></div>

    <div class="pointer-events-none absolute inset-0 flex items-center justify-center gap-1">
      <CbIcon name="location_on" class="text-surface" />
      <span class="rounded-lg bg-surface px-2 py-1 text-sm text-white">{{ cityName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import CbIcon from './CbIcon.vue'

const props = defineProps<{ cityName: string; latitude: number; longitude: number }>()
defineEmits<{ click: [] }>()

const mapContainer = useTemplateRef('mapContainer')
let map: L.Map | undefined

onMounted(() => {
  // The map is a picture, not a tool: every way of moving it is switched off.
  map = L.map(mapContainer.value!, {
    center: [props.latitude, props.longitude],
    zoom: 10,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false,
  })

  // OpenStreetMap asks for this credit line in return for the free tiles.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map)
})

onBeforeUnmount(() => map?.remove())
</script>
