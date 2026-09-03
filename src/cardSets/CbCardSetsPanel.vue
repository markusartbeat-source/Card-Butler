<template>
  <!-- The panel stands at the right edge of the project page, a thin line
       divides it from the cards. -->
  <aside class="w-44 shrink-0 border-l border-surface-light pt-8">
    <CbTableOfContents
      v-model="activeCardSet"
      :title="dictionary.cardSets.title"
      :items="cardSets"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbTableOfContents from '../components/atoms/CbTableOfContents.vue'

// Placeholder sets — they do not filter the cards yet.
const cardSets = [
  { value: 'player-cards', label: dictionary.cardSets.playerCards },
  { value: 'villain-cards', label: dictionary.cardSets.villainCards },
]

const activeCardSet = ref(cardSets[0].value)
</script>
