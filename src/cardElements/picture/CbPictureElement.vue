<template>
  <!-- Der Rahmen des Bilds. data-element-id lässt die Anfasser ihn auf der Karte
       finden, Lage und Größe gibt die Karte vor. Im Editor per Tab erreichbar
       und wie ein Knopf mit Enter oder Leertaste zu bedienen. Mit markIfEmpty
       zeigt sich ein Bild ohne gewähltes Bild als gestrichelter Rahmen mit
       Bild-Icon.
       Ausgewählt startet ein weiterer Klick (bzw. Enter) das Zuschneiden wie in
       Figma: Der Rahmen bleibt fest und golden umrandet, das ganze Bild
       erscheint – außerhalb des Rahmens halb durchsichtig. Die Tasten dafür
       nennt die aria-description. -->
  <div
    ref="frame"
    class="flex items-center justify-center"
    :class="{
      'cursor-pointer': editable,
      'border-background/70 text-background/70 border border-dashed': isMarkedEmpty,
      'outline-2 outline-gold': isCropping,
    }"
    :style="{ borderRadius }"
    :data-element-id="id"
    :tabindex="editable ? 0 : undefined"
    :role="editable ? 'button' : undefined"
    :aria-label="editable ? name : undefined"
    :aria-description="isCropping ? dictionary.cardEditor.croppingKeys : undefined"
    @click="selectOrStartCropping"
    @focus="selectOnKeyboardFocus"
    @keydown.enter.self.prevent="selectOrStartCropping"
    @keydown.space.self.prevent="selectOrStartCropping"
  >
    <!-- Das ganze Bild beim Zuschneiden. An ihm hängen die Anfasser
         (data-crop-picture), darum bekommt es die Maus. -->
    <img
      v-if="isCropping && picture"
      data-crop-picture
      :src="picture"
      alt=""
      draggable="false"
      class="absolute max-w-none cursor-move opacity-40"
      :style="cropStyle"
    />
    <!-- Die Bildebene schneidet das Bild am Rahmen ab, samt Rundung. Nur sie
         bekommt die Deckkraft, Rahmen und Icon bleiben voll sichtbar. Ohne
         Ausschnitt füllt das Bild den Rahmen, mittig, ohne Verzerren. -->
    <div
      v-ripple
      class="absolute inset-0 overflow-hidden"
      :class="{ 'pointer-events-none': isCropping }"
      :style="{ borderRadius }"
    >
      <img
        v-if="picture"
        :key="picture"
        :src="picture"
        alt=""
        draggable="false"
        class="absolute max-w-none"
        :class="{ 'size-full object-cover': !shownCrop }"
        :style="{ opacity, ...cropStyle }"
        @load="rememberPictureAspectRatio"
      />
    </div>
    <CbIcon v-if="isMarkedEmpty" name="add_photo_alternate" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import CbIcon from '../../components/atoms/CbIcon.vue'
import { cornerRadiiStyle, type CornerRadii } from '../../card/cornerRadii'
import {
  isEditingSelectedElement,
  selectedElementId,
  selectElement,
  startEditingElement,
} from '../../elementTransform/elementSelection'
import { coverCrop, type PictureCrop } from './pictureCrops'

// name ist der Name des Elements für Screenreader. Mit editable lässt es sich
// auswählen und zuschneiden – nur im Editor. opacity von 0 bis 1, cornerRadii in
// mm. picture ist die Adresse des Bildes, das diese Karte zeigt, crop sein
// Ausschnitt auf dieser Karte. frameAspectRatio ist Breite / Höhe des Rahmens.
const props = withDefaults(
  defineProps<{
    id: string
    name: string
    opacity: number
    cornerRadii: CornerRadii
    frameAspectRatio: number
    picture?: string
    crop?: PictureCrop
    markIfEmpty?: boolean
    editable?: boolean
  }>(),
  { markIfEmpty: false, editable: false },
)

const isMarkedEmpty = computed(() => props.markIfEmpty && !props.picture)

const borderRadius = computed(() => cornerRadiiStyle(props.cornerRadii))

const isCropping = computed(
  () => props.editable && isEditingSelectedElement.value && selectedElementId.value === props.id,
)

// Breite / Höhe des Bildes, bekannt sobald es geladen ist.
const pictureAspectRatio = ref<number>()
watch(
  () => props.picture,
  () => (pictureAspectRatio.value = undefined),
)

function rememberPictureAspectRatio(event: Event) {
  const { naturalWidth, naturalHeight } = event.target as HTMLImageElement
  pictureAspectRatio.value = naturalWidth / naturalHeight
}

// Beim Zuschneiden ohne eigenen Ausschnitt liegt das Bild so, wie es den Rahmen
// füllt – dort erscheint dann auch das ganze Bild.
const shownCrop = computed(() => {
  if (props.crop || !isCropping.value || !pictureAspectRatio.value) return props.crop
  return coverCrop(pictureAspectRatio.value, props.frameAspectRatio)
})

// Mitte, Breite und Drehung in Anteilen des Rahmens. Die Höhe folgt dem Bild,
// translate legt die Mitte auf den Punkt.
const cropStyle = computed(() => {
  const crop = shownCrop.value
  if (!crop) return {}
  return {
    left: `${crop.centerX * 100}%`,
    top: `${crop.centerY * 100}%`,
    width: `${crop.width * 100}%`,
    transform: `translate(-50%, -50%) rotate(${crop.rotation}deg)`,
  }
})

const frame = useTemplateRef<HTMLElement>('frame')

// Der 1. Klick wählt das Bild aus. Ein weiterer startet im Editor das
// Zuschneiden – nur, wenn diese Karte ein Bild zeigt.
function selectOrStartCropping() {
  if (!props.editable || selectedElementId.value !== props.id) return selectElement(props.id)
  if (props.picture) startEditingElement(props.id)
}

// Per Tastatur angesprungen wählt sich das Bild aus. Ein Mausklick fokussiert es
// auch, wählt aber erst mit dem Klick aus. Ist es schon ausgewählt, bleibt es
// dabei – sonst endete das Zuschneiden, sobald der Rahmen den Fokus bekommt.
function selectOnKeyboardFocus() {
  if (selectedElementId.value !== props.id && frame.value?.matches(':focus-visible')) {
    selectElement(props.id)
  }
}
</script>
