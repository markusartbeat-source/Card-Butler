<template>
  <!-- The panel stands at the right edge of the project page, a thin line
       divides it from the cards. The line runs the whole page height, the list
       inside sticks to the top while the page scrolls. -->
  <aside class="w-44 shrink-0 border-l border-surface-light">
    <div class="sticky top-0 pt-8">
      <!-- The marked entry follows the scrolling, a click glides to that set. -->
      <CbTableOfContents
        :model-value="visibleCardSetId"
        :title="dictionary.cardSets.title"
        :items="cardSetItems"
        @update:model-value="cardSetIdToShow = $event"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbTableOfContents from '../components/atoms/CbTableOfContents.vue'
import { cardSetIdToShow, cardSets } from './cardSets'
import { visibleCardSetId } from './visibleCardSet'

const cardSetItems = computed(() =>
  cardSets.value.map((cardSet) => ({ value: cardSet.id, label: cardSet.name })),
)
</script>
