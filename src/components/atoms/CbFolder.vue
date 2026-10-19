<template>
  <!-- Nur die Grafik (graphicOnly): ohne Namen, kein Knopf, füllt ihren Platz –
       z.B. im Betrachter. -->
  <component
    :is="graphicOnly ? 'div' : CbInteractive"
    class="flex flex-col items-center"
    :class="graphicOnly ? 'size-full' : 'w-24 gap-2.25 rounded-lg p-2'"
    @click="click"
  >
    <!-- The folder is drawn as an SVG, traced from the design file (100×83px,
         on the tile shown at 80×66px):
         a tab on the top left, the golden body and a picture set into it.
         The ids must be unique per instance, or three folders on one page
         would all reference the first one's gradients. Nur Schmuck, den
         Ordner benennt sein Name. -->
    <svg
      ref="graphic"
      viewBox="0 0 100 83"
      class="w-full drop-shadow-lg"
      :class="graphicOnly ? 'h-full' : 'h-16.5'"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`${id}-body`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: var(--color-gold-light)" />
          <stop offset="1" style="stop-color: var(--color-gold-dark)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 8 A 8 8 0 0 1 8 0 L 24.9 0 C 30.9 0 35.5 6.6 43.4 6.6 L 92 6.6 A 8 8 0 0 1 100 14.6 L 100 75 A 8 8 0 0 1 92 83 L 8 83 A 8 8 0 0 1 0 75 Z"
        :fill="`url(#${id}-body)`"
      />
      <!-- Das Bild passt ganz in seine Fläche (höchstens so hoch und so breit
           wie sie), mittig und mit runden Ecken. Als HTML-Bild, weil nur so die
           Ecken dem Bild folgen statt der Fläche; Maße darin in Einheiten der
           viewBox, wächst also mit dem Ordner. Ohne Bild bleibt er leer. -->
      <foreignObject v-if="picture" v-bind="pictureArea">
        <div class="flex size-full items-center justify-center">
          <img :src="picture" alt="" class="max-h-full max-w-full rounded-sm" />
        </div>
      </foreignObject>
    </svg>
    <!-- Lange Wörter brechen um, statt über die Kachel hinauszuragen. -->
    <span v-if="!graphicOnly" class="text-2xs w-full text-center wrap-break-word text-white">{{ name }}</span>
  </component>
</template>

<script lang="ts">
// Seitenverhältnis (Breite / Höhe) der Grafik, wie ihre viewBox.
export const folderGraphicRatio = 100 / 83
</script>

<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import CbInteractive from './CbInteractive.vue'

defineProps<{
  name: string
  graphicOnly?: boolean
  /** Adresse des Bildes, das im Ordner zu sehen ist, z.B. das erste darin. */
  picture?: string
}>()
// Mit dem Klick kommt, wo die Grafik steht – z.B. damit sie von dort fliegen kann.
const emit = defineEmits<{ click: [event: MouseEvent, graphicRect: DOMRect] }>()

const id = useId()
// Wo das Bild im Ordner sitzt, in Einheiten der viewBox.
const pictureArea = { x: 5, y: 11.7, width: 88.75, height: 64.9 }
const graphic = useTemplateRef<SVGSVGElement>('graphic')

function click(event: MouseEvent) {
  if (graphic.value) emit('click', event, graphic.value.getBoundingClientRect())
}
</script>
