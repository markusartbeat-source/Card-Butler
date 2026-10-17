<template>
  <!-- Wie bei Google Fotos: Jede Kachel startet in Zeilenhöhe und wächst in
       Breite und Höhe mit, bis die Zeile voll ist. Die Zeilen werden dadurch
       unterschiedlich hoch, aber kein Bild wird abgeschnitten. -->
  <div class="flex flex-wrap gap-3">
    <!-- Platz für eine Kachel vor den Bildern, z.B. „Bilder hochladen“. -->
    <slot name="leading" :tile-style="tileStyle" />

    <!-- The opened tile stays in the layout but hides: the viewer shows its
         picture flying up from that spot and back. -->
    <!-- Der Bildname im alt ist zugleich der Name des Buttons für Screenreader. -->
    <CbInteractive
      v-for="image in images"
      :key="image.id"
      :id="image.id"
      class="rounded-lg"
      :class="{ invisible: image.id === openedImageId }"
      :style="tileStyle(ratioOf(image))"
      @click="openImage(image, $event)"
    >
      <img
        :src="image.data.location"
        :alt="image.data.name"
        class="size-full object-cover"
        @load="rememberRatio(image, $event)"
      />
    </CbInteractive>
    <!-- Schluckt den freien Platz der letzten Zeile, damit deren Bilder nicht
         gestreckt werden. -->
    <div class="grow-1000" />
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

// Mindesthöhe einer Zeile, 302px aus dem Design. Auf kleineren Bildschirmen
// niedriger, damit noch ein zweites Bild daneben passt.
const isBelowTablet = useIsBelowBreakpoint('tablet')
const isBelowLaptop = useIsBelowBreakpoint('laptop')
const rowHeight = computed(() => (isBelowTablet.value ? 160 : isBelowLaptop.value ? 220 : 302))

// Wachstum im Verhältnis zur Breite: Alle Kacheln einer Zeile werden um
// denselben Faktor größer und behalten ihr Seitenverhältnis.
function tileStyle(ratio: number) {
  return { flexBasis: `${rowHeight.value * ratio}px`, flexGrow: ratio, aspectRatio: ratio }
}
</script>
