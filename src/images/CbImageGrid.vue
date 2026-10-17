<template>
  <!-- A justified gallery: every row has the same height, each picture starts
       at the width its aspect ratio gives it and grows in proportion until the
       row is filled, exactly like the rows in the design. -->
  <div class="flex flex-wrap gap-3">
    <!-- Platz für eine Kachel vor den Bildern, z.B. „Bilder hochladen“. -->
    <slot name="leading" :tile-style="leadingTileStyle" />

    <!-- The opened tile stays in the layout but hides: the viewer shows its
         picture flying up from that spot and back. -->
    <!-- Der Bildname im alt ist zugleich der Name des Buttons für Screenreader. -->
    <CbInteractive
      v-for="image in images"
      :key="image.id"
      :id="image.id"
      class="rounded-lg"
      :class="{ invisible: image.id === openedImageId }"
      :style="tileStyle(image)"
      @click="openImage(image, $event)"
    >
      <img
        :src="image.data.location"
        :alt="image.data.name"
        class="size-full object-cover"
        @load="rememberRatio(image, $event)"
      />
    </CbInteractive>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ImageResource } from '../api/images/imagesApi'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import { useIsBelowBreakpoint } from '../composables/useIsBelowBreakpoint'

defineProps<{ images: ImageResource[]; openedImageId?: string }>()
const emit = defineEmits<{ open: [image: ImageResource, tileRect: DOMRect, ratio: number] }>()

// Passes on where the clicked tile sits on the screen — the viewer starts its
// flight there.
function openImage(image: ImageResource, event: MouseEvent) {
  emit('open', image, (event.currentTarget as HTMLElement).getBoundingClientRect(), ratioOf(image))
}

// Seitenverhältnis (Breite / Höhe) je Bild. Das Backend kennt keine Pixelmaße,
// darum kommt es aus dem geladenen Bild. Bis dahin ist die Kachel quadratisch.
const ratioByImageId = ref<Record<string, number>>({})

function ratioOf(image: ImageResource) {
  return ratioByImageId.value[image.id] ?? 1
}

function rememberRatio(image: ImageResource, event: Event) {
  const element = event.target as HTMLImageElement
  ratioByImageId.value[image.id] = element.naturalWidth / element.naturalHeight
}

// 302px comes from the design; the smaller screens get lower rows so a
// picture still fits next to another one.
const isBelowTablet = useIsBelowBreakpoint('tablet')
const isBelowLaptop = useIsBelowBreakpoint('laptop')
const rowHeight = computed(() => (isBelowTablet.value ? 160 : isBelowLaptop.value ? 220 : 302))

function tileStyle(image: ImageResource) {
  const ratio = ratioOf(image)
  return { height: `${rowHeight.value}px`, flexBasis: `${rowHeight.value * ratio}px`, flexGrow: ratio }
}

// Die Kachel vor den Bildern ist so hoch wie eine Zeile und wächst nicht mit.
const leadingTileStyle = computed(() => ({ height: `${rowHeight.value}px`, flexShrink: 0 }))</script>
