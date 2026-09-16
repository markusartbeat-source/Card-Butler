<template>
  <!-- The window itself never scrolls: the page ends at the bottom edge of the
       screen, only the page area scrolls on its own. -->
  <div class="bg-background flex h-screen overflow-hidden">
    <!-- The header sits above the animated area, so a page change only moves
         the content below it. Each page says what it should show. -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- While a card is dragged, the header steps back and only the cards
           stay bright. -->
      <CbHeader
        :class="dimWhileDraggingClasses"
        :title="headerSettings.title"
        :searchbar="headerSettings.searchbar"
        :buttons="headerSettings.buttons"
        @action="headerSettings.onAction?.($event)"
      />

      <!-- The grid gives every page the same single cell, so the old and the new
           page overlap during the transition without changing their layout.
           Each page scrolls in its own wrapper (the page area), not in main:
           so a new page always starts at the top while the old one keeps its
           scroll position as it fades out. -->
      <main class="relative grid flex-1 grid-cols-1 grid-rows-1 overflow-hidden">
        <router-view v-slot="{ Component, route }">
          <Transition name="page">
            <div :key="route.path" class="cb-page-area col-start-1 row-start-1 h-full overflow-y-auto">
              <component :is="Component" />
            </div>
          </Transition>
        </router-view>
      </main>
    </div>
    <!-- Stands here and not on the page, because the page area moves during a
         page change and a fixed bar inside it would move with it. -->
    <CbCardDropBar />
    <CbToaster />
  </div>
</template>

<script setup lang="ts">
import CbHeader from './components/organisms/CbHeader.vue'
import { headerSettings } from './components/organisms/headerState'
import CbToaster from './components/atoms/CbToaster.vue'
import CbCardDropBar from './cardDrag/CbCardDropBar.vue'
import { dimWhileDraggingClasses } from './cardDrag/dimWhileDragging'
import { startPeopleBroadcast } from './presence/usePeopleBroadcast'

startPeopleBroadcast()
</script>

<style scoped>
/* The space for the scrollbar is always reserved, so a long page does not
   push the content sideways when its scrollbar appears. */
.cb-page-area {
  scrollbar-gutter: stable;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(2rem);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-2rem);
}
</style>
