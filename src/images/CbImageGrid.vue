<template>
  <!-- Wie bei Google Fotos: Jede Kachel startet in Zeilenhöhe und wächst in
       Breite und Höhe mit, bis die Zeile voll ist. Die Zeilen werden dadurch
       unterschiedlich hoch, aber kein Bild wird abgeschnitten. -->
  <!-- Ziehen sortiert die Bilder um, nur lokal: Das Backend kennt keine
       Reihenfolge. -->
  <VueDraggable
    v-model="images"
    v-bind="dragOptions"
    class="flex flex-wrap gap-3 select-none"
    @start="startDrag"
    @end="endDrag"
  >
    <!-- Platz für eine Kachel vor den Bildern, z.B. „Bilder hochladen“. -->
    <slot name="leading" :tile-style="tileStyle" />

    <!-- The opened tile stays in the layout but hides: the viewer shows its
         picture flying up from that spot and back. -->
    <!-- Die Kachel nimmt die Bibliothek beim Ziehen auf und bewegt sie per
         „transform“. Kippen und Schatten liegen darum am Knopf darin (siehe
         style.css). -->
    <div
      v-for="image in images"
      :key="image.id"
      class="cb-image-tile grid"
      :class="{ invisible: image.id === openedImageId }"
      :style="tileStyle(ratioOf(image))"
    >
      <!-- Der Bildname im alt ist zugleich der Name des Buttons für Screenreader. -->
      <CbInteractive
        :id="image.id"
        class="cb-image-face cursor-grab rounded-lg active:cursor-grabbing"
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
    <!-- Schluckt den freien Platz der letzten Zeile, damit deren Bilder nicht
         gestreckt werden. -->
    <div class="grow-1000" />
  </VueDraggable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { ImageResource } from '../api/images/imagesApi'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import { useIsBelowBreakpoint } from '../composables/useIsBelowBreakpoint'

const images = defineModel<ImageResource[]>('images', { required: true })
defineProps<{ openedImageId?: string }>()
const emit = defineEmits<{ open: [image: ImageResource, tileRect: DOMRect, ratio: number] }>()

// Wie bei den Karten (cardDragOptions). Nur die Bildkacheln sind ziehbar: Die
// Kachel vorn und der Füller am Ende bleiben stehen, ein Bild landet immer
// zwischen anderen Bildern.
const dragOptions = {
  animation: 200,
  draggable: '.cb-image-tile',
  forceFallback: true,
  fallbackTolerance: 8,
  ghostClass: 'cb-image-ghost',
  dragClass: 'cb-image-dragged',
}

// Ein beendetes Ziehen löst danach noch einen Klick auf die Kachel aus. Der
// soll den Betrachter nicht öffnen, darum bleibt das Ziehen bis nach dem
// Klick bestehen.
let isDragging = false

function startDrag() {
  isDragging = true
}

function endDrag() {
  setTimeout(() => {
    isDragging = false
  }, 0)
}

// Passes on where the clicked tile sits on the screen — the viewer starts its
// flight there.
function openImage(image: ImageResource, event: MouseEvent) {
  if (isDragging) return
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

// Mindesthöhe einer Zeile, bewusst kleiner als die 302px aus dem Design, damit
// mehr Bilder auf einen Blick passen. Auf kleineren Bildschirmen niedriger,
// damit noch ein zweites Bild daneben passt.
const isBelowTablet = useIsBelowBreakpoint('tablet')
const isBelowLaptop = useIsBelowBreakpoint('laptop')
const rowHeight = computed(() => (isBelowTablet.value ? 120 : isBelowLaptop.value ? 160 : 180))

// Wachstum im Verhältnis zur Breite: Alle Kacheln einer Zeile werden um
// denselben Faktor größer und behalten ihr Seitenverhältnis.
function tileStyle(ratio: number) {
  return { flexBasis: `${rowHeight.value * ratio}px`, flexGrow: ratio, aspectRatio: ratio }
}
</script>
