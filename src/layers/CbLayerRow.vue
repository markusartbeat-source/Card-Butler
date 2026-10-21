<template>
  <!-- Eine Ebene der Liste: Typ-Icon und Name ihres Elements. Das Icon sitzt
       wie im Design mittig in einem 32-px-Feld. -->
  <li class="flex h-16 items-center gap-1.5 rounded-md bg-surface-light p-1.5 text-sm">
    <CbIcon :name="elementTypeIcons[element.data.type]" class="mx-1" />
    <span class="truncate">{{ element.data.name }}</span>
  </li>
</template>

<script setup lang="ts">
import CbIcon from '../components/atoms/CbIcon.vue'
import { elementTypeIcons } from '../components/molecules/cardToolbarElements'
import type { CardSetElement } from '../cardSets/cardSets'

defineProps<{ element: CardSetElement }>()
</script>
