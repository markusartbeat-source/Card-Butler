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
         would all reference the first one's gradients. -->
    <svg
      ref="graphic"
      viewBox="0 0 100 83"
      class="w-full drop-shadow-lg"
      :class="graphicOnly ? 'h-full' : 'h-16.5'"
    >
      <defs>
        <linearGradient :id="`${id}-body`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: var(--color-gold-light)" />
          <stop offset="1" style="stop-color: var(--color-gold-dark)" />
        </linearGradient>
        <linearGradient :id="`${id}-picture`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style="stop-color: var(--color-cursor-blue)" />
          <stop offset="1" style="stop-color: var(--color-cursor-purple)" />
        </linearGradient>
        <!-- Inner shadow like in the design: 0 2px 6px at 25 % black. -->
        <filter :id="`${id}-inset`">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite operator="out" in="SourceGraphic" in2="blur" result="inverse" />
          <feFlood flood-color="black" flood-opacity="0.25" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>
      <path
        d="M 0 8 A 8 8 0 0 1 8 0 L 24.9 0 C 30.9 0 35.5 6.6 43.4 6.6 L 92 6.6 A 8 8 0 0 1 100 14.6 L 100 75 A 8 8 0 0 1 92 83 L 8 83 A 8 8 0 0 1 0 75 Z"
        :fill="`url(#${id}-body)`"
      />
      <rect
        x="5"
        y="11.7"
        width="88.75"
        height="64.9"
        rx="5"
        :fill="`url(#${id}-picture)`"
        :filter="`url(#${id}-inset)`"
      />
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

defineProps<{ name: string; graphicOnly?: boolean }>()
// Mit dem Klick kommt, wo die Grafik steht – z.B. damit sie von dort fliegen kann.
const emit = defineEmits<{ click: [event: MouseEvent, graphicRect: DOMRect] }>()

const id = useId()
const graphic = useTemplateRef<SVGSVGElement>('graphic')

function click(event: MouseEvent) {
  if (graphic.value) emit('click', event, graphic.value.getBoundingClientRect())
}
</script>
