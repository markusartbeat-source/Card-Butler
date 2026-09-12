<template>
  <!-- The panel stands at the right edge of the project page, a thin line
       divides it from the cards. -->
  <aside class="w-44 shrink-0 border-l border-surface-light pt-8">
    <CbTableOfContents
      v-model="activeCardSet"
      :title="dictionary.cardSets.title"
      :items="cardSetItems"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbTableOfContents from '../components/atoms/CbTableOfContents.vue'
import { cardSets } from './cardSets'

// The sets do not filter the cards yet.
const cardSetItems = computed(() =>
  cardSets.value.map((cardSet) => ({ value: cardSet.id, label: cardSet.name })),
)

const activeCardSet = ref(cardSets.value[0].id)
</script>
