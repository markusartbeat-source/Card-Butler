<template>
  <!-- The panel floats over the cards at the right edge of the project page and
       slides in from there. It sticks to the top while the page scrolls and is
       as tall as the page area. The thin gradient line on its left divides it
       from the cards, the blurred, half transparent surface gives it the dark
       glass look of the other panels. -->
  <Transition name="slide" appear>
    <aside
      v-show="isCardSetsPanelShown"
      class="cb-card-sets-panel sticky top-0 z-10 w-44 self-start justify-self-end bg-gradient-to-b from-white/30 to-transparent pl-px"
    >
      <div
        class="h-full bg-gradient-to-b from-surface/80 to-background/80 pt-8 backdrop-blur-md"
      >
        <!-- The marked entry follows the scrolling, a click glides to that set. -->
        <CbTableOfContents
          :model-value="visibleCardSetId"
          :title="dictionary.cardSets.title"
          :items="cardSetItems"
          @update:model-value="cardSetIdToShow = $event"
        />
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbTableOfContents from '../components/atoms/CbTableOfContents.vue'
import { cardSetIdToShow, cardSets } from './cardSets'
import { isCardSetsPanelShown } from './panelVisibility'
import { visibleCardSetId } from './visibleCardSet'

const cardSetItems = computed(() =>
  cardSets.value.map((cardSet) => ({ value: cardSet.id, label: cardSet.name })),
)
</script>

<style scoped>
/* The page area is the screen minus the 100px header (see CbHeader). */
.cb-card-sets-panel {
  height: calc(100vh - 100px);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 350ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
