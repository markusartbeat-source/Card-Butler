<template>
  <!-- Der Rahmen des Bilds. data-element-id lässt die Anfasser ihn auf der Karte
       finden, Lage und Größe gibt die Karte vor. Im Editor per Tab erreichbar
       und wie ein Knopf mit Enter oder Leertaste auszuwählen. Mit markIfEmpty
       zeigt sich ein Bild ohne gewähltes Bild als gestrichelter Rahmen mit
       Bild-Icon.
       Die Karte setzt den Rahmen per absolute – darin liegt die Bildebene, die
       Rundung der Ecken schneidet sie mit ab. -->
  <div
    ref="frame"
    v-ripple
    class="flex items-center justify-center overflow-hidden"
    :class="{
      'cursor-pointer': editable,
      'border-background/70 text-background/70 border border-dashed': isMarkedEmpty,
    }"
    :style="{ borderRadius: cornerRadiiStyle(cornerRadii) }"
    :data-element-id="id"
    :tabindex="editable ? 0 : undefined"
    :role="editable ? 'button' : undefined"
    :aria-label="editable ? name : undefined"
    @click="selectElement(id)"
    @focus="selectOnKeyboardFocus"
    @keydown.enter.self.prevent="selectElement(id)"
    @keydown.space.self.prevent="selectElement(id)"
  >
    <!-- Die Bildebene: Nur sie bekommt die Deckkraft, Rahmen und Icon bleiben
         voll sichtbar. Das Bild füllt den Rahmen, mittig, ohne Verzerren. -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ opacity, backgroundImage: picture && `url('${picture}')` }"
    />
    <CbIcon v-if="isMarkedEmpty" name="add_photo_alternate" />
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import CbIcon from '../../components/atoms/CbIcon.vue'
import { cornerRadiiStyle, type CornerRadii } from '../../card/cornerRadii'
import { selectElement } from '../../elementTransform/elementSelection'

// name ist der Name des Elements für Screenreader. Mit editable lässt es sich
// auswählen – nur im Editor. opacity von 0 bis 1, cornerRadii in mm. picture ist
// die Adresse des Bildes, das diese Karte zeigt.
const props = withDefaults(
  defineProps<{
    id: string
    name: string
    opacity: number
    cornerRadii: CornerRadii
    picture?: string
    markIfEmpty?: boolean
    editable?: boolean
  }>(),
  { markIfEmpty: false, editable: false },
)

const isMarkedEmpty = computed(() => props.markIfEmpty && !props.picture)

const frame = useTemplateRef<HTMLElement>('frame')

// Per Tastatur angesprungen wählt sich das Bild aus. Ein Mausklick fokussiert es
// auch, wählt aber erst mit dem Klick aus.
function selectOnKeyboardFocus() {
  if (frame.value?.matches(':focus-visible')) selectElement(props.id)
}
</script>
