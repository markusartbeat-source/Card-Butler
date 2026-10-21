<template>
  <!-- Wie bei Google Fotos: Jede Kachel startet in Zeilenhöhe und wächst in
       Breite und Höhe mit, bis die Zeile voll ist. Die Zeilen werden dadurch
       unterschiedlich hoch, aber kein Bild wird abgeschnitten. -->
  <!-- Ziehen sortiert die Bilder um, nur lokal: Das Backend kennt keine
       Reihenfolge. Nur die Bildkacheln sind ziehbar: Die Kachel vorn und der
       Füller am Ende bleiben stehen, ein Bild landet immer zwischen anderen. -->
  <VueDraggable
    v-model="images"
    v-bind="dragOptions"
    draggable=".cb-image-tile"
    class="flex flex-wrap gap-3 select-none"
    @start="startDrag('image', $event)"
    @end="emit('dragEnd', $event)"
  >
    <!-- Platz für eine Kachel vor den Bildern, z.B. „Bilder hochladen“. -->
    <slot name="leading" :tile-style="tileStyle" />

    <!-- The opened tile stays in the layout but hides: the viewer shows its
         picture flying up from that spot and back. -->
    <!-- Die Kachel nimmt die Bibliothek beim Ziehen auf und bewegt sie per
         „transform“. Kippen und Schatten liegen darum am Knopf darin (siehe
         style.css). -->
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="cb-image-tile grid"
      :class="[{ invisible: image.id === openedImageId }, dimWhileDraggingOtherThan('image')]"
      :style="tileStyle(ratioOf(image))"
    >
      <!-- Der Bildname im alt ist zugleich der Name des Buttons für Screenreader. -->
      <!-- Alt+Pfeil sortiert per Tastatur, Strg+C/X kopiert bzw. schneidet aus
           (abgefangen von der Seite). Ausgeschnitten ist das Bild halb
           durchsichtig. Position und „ausgeschnitten“ stehen für Screenreader
           in der aria-description. -->
      <CbInteractive
        :id="image.id"
        class="cb-image-face cursor-grab rounded-lg active:cursor-grabbing"
        :class="{ 'opacity-50': isCutImage(image) }"
        :aria-keyshortcuts="`${sortingKeyShortcuts} ${clipboardKeyShortcuts}`"
        :aria-description="tileDescription(image, index)"
        @click="openImage(image, $event)"
        @keydown="sortWithAltArrow($event, images, image)"
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
import { dimWhileDraggingOtherThan } from '../dragAndDrop/dimWhileDragging'
import { dragOptions } from '../dragAndDrop/dragOptions'
import { isDragging, startDrag } from '../dragAndDrop/dragState'
import { sortingKeyShortcuts, sortWithAltArrow } from '../keyboard/sortWithAltArrow'
import { clipboardKeyShortcuts, isCutImage } from './imageClipboard'

const images = defineModel<ImageResource[]>('images', { required: true })
defineProps<{ openedImageId?: string }>()
const emit = defineEmits<{
  open: [image: ImageResource, tileRect: DOMRect, ratio: number]
  /** Losgelassen. Was das Ablegen bedeutet, liest die Seite per endDrag ab,
      danach gibt sie den Zieh-Zustand mit releaseDrag frei. */
  dragEnd: [event: { newDraggableIndex?: number }]
}>()

// Passes on where the clicked tile sits on the screen — the viewer starts its
// flight there. Der Klick nach einem beendeten Ziehen öffnet nichts.
function openImage(image: ImageResource, event: MouseEvent) {
  if (isDragging.value) return
  emit('open', image, (event.currentTarget as HTMLElement).getBoundingClientRect(), ratioOf(image))
}

// Seitenverhältnis (Breite / Höhe) je Bild. Das Backend kennt keine Pixelmaße,
// darum kommt es aus dem geladenen Bild. Bis dahin ist die Kachel quadratisch.
const ratioByImageId = ref<Record<string, number>>({})

function tileDescription(image: ImageResource, index: number) {
  const position = dictionary.general.positionOf(index + 1, images.value.length)
  return isCutImage(image) ? `${dictionary.images.markedAsCut}, ${position}` : position
}

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
