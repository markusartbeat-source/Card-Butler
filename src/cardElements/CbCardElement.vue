<template>
  <CbTextElement
    v-if="element.data.type === 'TEXT'"
    :element="element"
    :content="values[element.id]?.text ?? ''"
    :placeholder="markIfEmpty ? element.data.name : undefined"
    :highlight-search="highlightSearch"
    :editable="editable"
    :style="sizeStyle"
    @update:content="emit('changeValue', $event)"
  />
  <CbPictureElement
    v-else-if="element.data.type === 'PICTURE'"
    :element="element"
    :picture="picture"
    :crop="pictureCrop"
    :mark-if-empty="markIfEmpty"
    :editable="editable"
    :style="sizeStyle"
  />
  <CbShapeElement
    v-else-if="element.data.type === 'SQUARE' || element.data.type === 'CIRCLE'"
    :element="element"
    :editable="editable"
    :style="sizeStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardSetElement } from '../cardSets/cardSets'
import { knownImages } from '../images/knownImages'
import type { CardElementValues } from './cardValues'
import CbPictureElement from './picture/CbPictureElement.vue'
import { pictureCropOf } from './picture/pictureCrops'
import CbShapeElement from './shape/CbShapeElement.vue'
import CbTextElement from './text/CbTextElement.vue'
import { textSizingOf } from './text/textSizing'

// Ein Element des Sets, so wie es eine Karte zeigt – mit dem, was sie einträgt
// (values). Jeder Typ bringt seine Komponente aus seinem Ordner mit, Linien
// werden noch nicht gezeichnet. Die Lage gibt der Aufrufer per style dazu.
// markIfEmpty zeigt ein leeres Element mit Rahmen und Namen bzw. Icon,
// editable macht es bedienbar, highlightSearch markiert die Suchtreffer im Text.
const props = withDefaults(
  defineProps<{
    element: CardSetElement
    cardId: string
    values: CardElementValues
    markIfEmpty?: boolean
    editable?: boolean
    highlightSearch?: boolean
  }>(),
  { markIfEmpty: false, editable: false, highlightSearch: false },
)

const emit = defineEmits<{ changeValue: [value: string] }>()

// Das Bild, das diese Karte im Bild-Element zeigt, und sein Ausschnitt hier.
const imageId = computed(() => props.values[props.element.id]?.imageId)
const picture = computed(() =>
  imageId.value ? knownImages.value[imageId.value]?.location : undefined,
)
const pictureCrop = computed(() =>
  imageId.value ? pictureCropOf(props.cardId, props.element.id, imageId.value) : undefined,
)

// Größe (mm) und Deckkraft. Eine automatische Seite eines Textfelds bleibt offen
// und wächst mit dem Inhalt – undefined löscht dabei auch die px, die die
// Anfasser beim Ziehen setzen. Bilder und Formen haben immer eine feste Größe.
// Beim Bild gilt die Deckkraft nur dem Bild im Rahmen, das setzt es selbst.
const sizeStyle = computed(() => {
  const { data } = props.element
  const sizing = textSizingOf(props.element)
  return {
    width: sizing === 'autoWidth' ? undefined : `${data.width}mm`,
    height: sizing === 'fixed' ? `${data.height}mm` : undefined,
    opacity: data.type === 'PICTURE' ? undefined : data.opacity,
  }
})
</script>
