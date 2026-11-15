<template>
  <!-- Ein Viereck oder Kreis, gefüllt mit seiner Farbe, oder eine Linie.
       data-element-id lässt die Anfasser es auf der Karte finden, Lage, Größe
       und Deckkraft gibt die Karte vor. Im Editor per Tab erreichbar und wie ein
       Knopf mit Enter oder Leertaste auszuwählen – einen 2. Schritt zum
       Bearbeiten wie beim Text gibt es nicht. Die Linie bekommt eine
       unsichtbare Klickfläche, mindestens 24 px hoch (WCAG 2.5.8). Die ragt
       über die Box hinaus, darum schneidet die Linie nichts ab und hat keinen
       Klick-Kreis. -->
  <div
    v-ripple="!isLine"
    :class="[
      isLine ? 'relative before:absolute before:inset-x-0 before:-inset-y-3' : 'overflow-hidden',
      { 'cursor-pointer': editable },
    ]"
    :style="shapeStyle"
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
import { lineAppearanceOf, shapeAppearanceOf } from './shapeAppearance'

// Mit editable lässt sie sich auswählen – nur im Editor.
const props = withDefaults(defineProps<{ element: CardSetElement; editable?: boolean }>(), {
  editable: false,
})

const isLine = computed(() => props.element.data.type === 'LINE')

// Der Kreis ist voll gerundet – bei ungleicher Breite und Höhe eine Ellipse.
const borderRadius = computed(() => {
  const { id, data } = props.element
  if (data.type === 'CIRCLE') return '50%'
  return cornerRadiiStyle(cornerRadiiOfElement(id, data.radius))
})

// Die Kontur liegt wie in Figma innen: Die Box zählt sie zu ihrer Größe
// (border-box). Stärke in mm, SOLID/DASHED klein geschrieben sind die
// CSS-Linienarten. Die Linie ist der obere Rand ihrer Box, die so hoch ist wie
// der Strich – so geht auch gestrichelt.
const shapeStyle = computed(() => {
  const { data } = props.element
  if (data.type === 'LINE') {
    const { color, lineType, lineWidth } = lineAppearanceOf(data)
    return { borderTop: `${lineWidth}mm ${lineType.toLowerCase()} ${color}` }
  }

  const { color, border } = shapeAppearanceOf(data)
  return {
    backgroundColor: color,
    border: `${border.width}mm ${border.lineType.toLowerCase()} ${border.color}`,
    borderRadius: borderRadius.value,
  }
})

function selectShape() {
  selectOrStartEditing(props.element.id, props.editable, () => {})
}
</script>
