<template>
  <!-- The strip stands invisibly at the right edge of the project page, sticks
       to the top while the page scrolls and is as tall as the page area. The
       cursor touching it slides the panel in over the cards; the strip then
       grows to the panel's width, so leaving it means leaving the panel, which
       starts the timer that slides the panel out again. -->
  <div
    class="cb-card-sets-panel sticky top-0 z-10 flex min-w-6 self-start justify-self-end"
    @mouseenter="cursorEnteredCardSetsPanel"
    @mouseleave="cursorLeftCardSetsPanel"
  >
    <!-- The thin gradient line on the panel's left divides it from the cards,
         the blurred, half transparent surface gives it the dark glass look of
         the other panels. -->
    <Transition name="slide">
      <aside
        v-show="isCardSetsPanelShown"
        class="w-44 bg-gradient-to-b from-white/30 to-transparent pl-px"
      >
        <div
          class="h-full bg-gradient-to-b from-surface/80 to-background/80 pt-8 backdrop-blur-md"
        >
          <!-- The marked entry follows the scrolling with a short lag, a click
               glides to that set. -->
          <CbTableOfContents
            :model-value="markedCardSetId"
            :title="dictionary.cardSets.title"
            :items="cardSetItems"
            @update:model-value="cardSetIdToShow = $event"
          />
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import CbTableOfContents from '../components/atoms/CbTableOfContents.vue'
import { cardSetIdToShow, cardSets } from './cardSets'
import {
  cursorEnteredCardSetsPanel,
  cursorLeftCardSetsPanel,
  flashCardSetsPanel,
  isCardSetsPanelShown,
  markedCardSetId,
} from './panelVisibility'
import { visibleCardSetId } from './visibleCardSet'

const cardSetItems = computed(() =>
  cardSets.value.map((cardSet) => ({ value: cardSet.id, label: cardSet.name })),
)

// Scrolling into another set shows the panel briefly and moves the mark.
watch(visibleCardSetId, flashCardSetsPanel)
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
