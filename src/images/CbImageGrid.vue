<template>
  <!-- A justified gallery: every row has the same height, each picture starts
       at the width its aspect ratio gives it and grows in proportion until the
       row is filled, exactly like the rows in the design. -->
  <div class="flex flex-wrap gap-3">
    <!-- Platz für eine Kachel vor den Bildern, z.B. „Bilder hochladen“. -->
    <slot name="leading" :tile-style="leadingTileStyle" />

    <!-- The opened tile stays in the layout but hides: the viewer shows its
         picture flying up from that spot and back. -->
    <CbInteractive
      v-for="image in images"
      :key="image.id"
      :id="image.id"
      class="rounded-lg bg-gradient-to-br"
      :class="[image.gradientClasses, { invisible: image.id === openedImageId }]"
      :style="tileStyle(image)"
      @click="openImage(image, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import { useIsBelowBreakpoint } from '../composables/useIsBelowBreakpoint'
import type { DummyImage } from './dummyImages'

defineProps<{ images: DummyImage[]; openedImageId?: string }>()
const emit = defineEmits<{ open: [image: DummyImage, tileRect: DOMRect] }>()

// Passes on where the clicked tile sits on the screen — the viewer starts its
// flight there.
function openImage(image: DummyImage, event: MouseEvent) {
  emit('open', image, (event.currentTarget as HTMLElement).getBoundingClientRect())
}

// 302px comes from the design; the smaller screens get lower rows so a
// picture still fits next to another one.
const isBelowTablet = useIsBelowBreakpoint('tablet')
const isBelowLaptop = useIsBelowBreakpoint('laptop')
const rowHeight = computed(() => (isBelowTablet.value ? 160 : isBelowLaptop.value ? 220 : 302))

function tileStyle(image: DummyImage) {
  const ratio = image.ratioWidth / image.ratioHeight
  return { height: `${rowHeight.value}px`, flexBasis: `${rowHeight.value * ratio}px`, flexGrow: ratio }
}

// Die Kachel vor den Bildern ist so hoch wie eine Zeile und wächst nicht mit.
const leadingTileStyle = computed(() => ({ height: `${rowHeight.value}px`, flexShrink: 0 }))</script>
