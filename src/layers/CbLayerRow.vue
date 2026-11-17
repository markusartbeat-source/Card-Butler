<template>
  <!-- Eine Ebene der Liste: Vorschaubild, Typ-Icon und Name ihres Elements, rechts
       zwei Knöpfe – auf der Karte aufglänzen lassen bzw. auswählen. Das Icon
       sitzt wie im Design mittig in einem 32-px-Feld. Gezogen wird die ganze
       Zeile, per Tastatur sortiert Alt+Pfeil auf einem der Knöpfe. Beim Ziehen
       kippt die Zeile, nicht das Listenelement darum (siehe style.css). -->
  <div
    class="group cb-regular-text cb-layer-face flex h-16 w-full cursor-grab items-center gap-1.5 rounded-md bg-surface-light p-1.5 ring ring-surface-edge active:cursor-grabbing"
  >
    <CbLayerPreview :element="element" :card="card" :card-color="cardColor" />
    <CbIcon :name="elementTypeIcons[element.data.type]" class="mx-1" />
    <span class="flex-1 truncate">{{ element.data.name }}</span>
    <CbTooltip :text="dictionary.cardEditor.shineLayer(element.data.name)">
      <CbButton
        variant="icon"
        size="small"
        :class="shownOnRowHoverClasses"
        :aria-label="dictionary.cardEditor.shineLayer(element.data.name)"
        :aria-keyshortcuts="sortingKeyShortcuts"
        :aria-description="positionDescription"
        @click="$emit('shine')"
        @keydown="$emit('sortKey', $event)"
      >
        <CbIcon name="visibility" />
      </CbButton>
    </CbTooltip>
    <CbTooltip :text="dictionary.cardEditor.selectLayer(element.data.name)">
      <CbButton
        variant="icon"
        size="small"
        :class="shownOnRowHoverClasses"
        :aria-label="dictionary.cardEditor.selectLayer(element.data.name)"
        :aria-keyshortcuts="sortingKeyShortcuts"
        :aria-description="positionDescription"
        @click="$emit('select')"
        @keydown="$emit('sortKey', $event)"
      >
        <CbIcon name="edit" />
      </CbButton>
    </CbTooltip>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbTooltip from '../components/atoms/CbTooltip.vue'
import { elementTypeIcons } from '../components/molecules/cardToolbarElements'
import type { Card, CardSetElement } from '../cardSets/cardSets'
import { sortingKeyShortcuts } from '../keyboard/sortWithAltArrow'
import CbLayerPreview from './CbLayerPreview.vue'

// card ist die offene Karte, ihre Werte zeigt das Vorschaubild auf cardColor,
// der Farbe der Karte. positionDescription hören Screenreader an beiden Knöpfen,
// z.B. „Ebene 2 von 5“.
defineProps<{ element: CardSetElement; card: Card; cardColor: string; positionDescription: string }>()

// sortKey: eine Taste auf einem der Knöpfe – zum Sortieren mit Alt+Pfeil.
defineEmits<{ shine: []; select: []; sortKey: [event: KeyboardEvent] }>()

// Ab Laptop-Breite zeigen sich die Knöpfe erst, wenn die Maus auf der Zeile ist
// oder die Tastatur darin steht. Kleiner (Handy, Tablet) sind sie immer da.
const shownOnRowHoverClasses =
  'laptop:opacity-0 laptop:group-hover:opacity-100 laptop:group-focus-within:opacity-100'
</script>
