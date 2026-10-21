<template>
  <!-- Eine Ebene der Liste: Vorschaubild, Typ-Icon und Name ihres Elements. Das
       Icon sitzt wie im Design mittig in einem 32-px-Feld. Ein Knopf – was ein
       Klick tut, legt die Liste fest; sein Name ist der des Elements. Beim Ziehen
       kippt der Knopf, nicht das Listenelement darum (siehe style.css). -->
  <CbInteractive
    class="cb-layer-face flex h-16 w-full cursor-grab items-center gap-1.5 rounded-md bg-surface-light p-1.5 text-left text-sm active:cursor-grabbing"
  >
    <CbLayerPreview :element="element" :card="card" />
    <CbIcon :name="elementTypeIcons[element.data.type]" class="mx-1" />
    <span class="truncate">{{ element.data.name }}</span>
  </CbInteractive>
</template>

<script setup lang="ts">
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import { elementTypeIcons } from '../components/molecules/cardToolbarElements'
import type { Card, CardSetElement } from '../cardSets/cardSets'
import CbLayerPreview from './CbLayerPreview.vue'

// card ist die offene Karte, ihre Werte zeigt das Vorschaubild.
defineProps<{ element: CardSetElement; card: Card }>()
</script>
