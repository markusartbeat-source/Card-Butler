<template>
  <!-- Eine Form, gefüllt mit ihrer Farbe. data-element-id lässt die Anfasser sie
       auf der Karte finden, Lage, Größe und Deckkraft gibt die Karte vor. Im
       Editor per Tab erreichbar und wie ein Knopf mit Enter oder Leertaste
       auszuwählen – einen 2. Schritt zum Bearbeiten wie beim Text gibt es nicht. -->
  <div
    v-ripple
    class="overflow-hidden"
    :class="{ 'cursor-pointer': editable }"
    :style="{ backgroundColor: element.data.color ?? undefined, borderRadius }"
    :data-element-id="element.id"
    :tabindex="editable ? 0 : undefined"
    :role="editable ? 'button' : undefined"
    :aria-label="editable ? element.data.name : undefined"
    @click="selectShape"
    @focus="selectOnKeyboardFocus(element.id, $event)"
    @keydown.enter.self.prevent="selectShape"
    @keydown.space.self.prevent="selectShape"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cornerRadiiStyle } from '../../card/cornerRadii'
import type { CardSetElement } from '../../cardSets/cardSets'
import { selectOnKeyboardFocus, selectOrStartEditing } from '../../elementTransform/elementSelection'
import { cornerRadiiOfElement } from '../elementCornerRadii'

// Mit editable lässt sie sich auswählen – nur im Editor.
const props = withDefaults(defineProps<{ element: CardSetElement; editable?: boolean }>(), {
  editable: false,
})

const borderRadius = computed(() => {
  const { id, data } = props.element
  return cornerRadiiStyle(cornerRadiiOfElement(id, data.radius))
})

function selectShape() {
  selectOrStartEditing(props.element.id, props.editable, () => {})
}
</script>
