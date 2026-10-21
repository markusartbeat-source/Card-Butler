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
    class="flex items-center justify-center"
    :class="{
      'cursor-pointer': editable,
      'border-background/70 text-background/70 border border-dashed': isMarkedEmpty,
      'outline-2 outline-gold': isCropping,
    }"
    :style="{ borderRadius }"
    :data-element-id="element.id"
    :tabindex="editable ? 0 : undefined"
    :role="editable ? 'button' : undefined"
    :aria-label="editable ? element.data.name : undefined"
    :aria-description="isCropping ? dictionary.cardEditor.croppingKeys : undefined"
    @click="selectOrStartCropping"
    @focus="selectOnKeyboardFocus(element.id, $event)"
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
        :style="{ opacity: element.data.opacity, ...cropStyle }"
        @load="rememberPictureAspectRatio"
      />
    </div>
    <CbIcon v-if="isMarkedEmpty" name="add_photo_alternate" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbIcon from '../../components/atoms/CbIcon.vue'
import { cornerRadiiStyle } from '../../card/cornerRadii'
import type { CardSetElement } from '../../cardSets/cardSets'
import {
  isEditingElement,
  selectOnKeyboardFocus,
  selectOrStartEditing,
  startEditingElement,
} from '../../elementTransform/elementSelection'
import { cornerRadiiOfElement } from '../elementCornerRadii'
import { coverCrop, type PictureCrop } from './pictureCrops'

// Mit editable lässt es sich auswählen und zuschneiden – nur im Editor. picture
// ist die Adresse des Bildes, das diese Karte zeigt, crop sein Ausschnitt auf
// dieser Karte.
const props = withDefaults(
  defineProps<{
    element: CardSetElement
    picture?: string
    crop?: PictureCrop
    markIfEmpty?: boolean
    editable?: boolean
  }>(),
  { markIfEmpty: false, editable: false },
)

const isMarkedEmpty = computed(() => props.markIfEmpty && !props.picture)

const borderRadius = computed(() => {
  const { id, data } = props.element
  return cornerRadiiStyle(cornerRadiiOfElement(id, data.radius))
})

const isCropping = computed(() => props.editable && isEditingElement(props.element.id))

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
  const { width, height } = props.element.data
  return coverCrop(pictureAspectRatio.value, width / height)
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

// Zuschneiden geht nur, wenn diese Karte ein Bild zeigt.
function selectOrStartCropping() {
  selectOrStartEditing(props.element.id, props.editable, () => {
    if (props.picture) startEditingElement(props.element.id)
  })
}
</script>
