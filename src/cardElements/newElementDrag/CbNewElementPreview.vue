<template>
  <!-- Mitte unter dem Zeiger. Lässt den Zeiger durch, damit das Loslassen die
       Karte darunter trifft. Gold auf dunklem Grund ist über dem abgedunkelten
       Hintergrund genauso gut zu sehen wie über der weißen Karte. -->
  <div
    class="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2"
    :style="{ left: `${x}px`, top: `${y}px` }"
    aria-hidden="true"
  >
    <div
      class="border-gold bg-background/80 text-gold overflow-hidden rounded border border-dashed px-1 shadow-lg"
      :style="{ width: `${element.width}mm`, height: `${element.height}mm`, zoom: editorZoom }"
    >
      {{ element.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ElementData } from '../../api/elements/elementsApi'
import { editorZoom } from '../../card/cardFormat'

// Vorschau eines neuen Elements beim Ziehen aus der Toolbar, so groß wie auf der
// Karte im Editor. x/y ist die Zeigerposition (px).
defineProps<{ x: number; y: number; element: ElementData }>()
</script>
