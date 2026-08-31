<template>
  <!-- The window itself never scrolls: sidebar and page both end at the
       bottom edge of the screen, only the page area scrolls on its own. -->
  <div class="bg-background flex h-screen overflow-hidden">
    <CbSidebar />
    <!-- The grid gives every page the same single cell, so the old and the new
         page overlap during the transition without changing their layout. -->
    <main class="relative grid flex-1 grid-cols-1 grid-rows-1 overflow-y-auto">
      <router-view v-slot="{ Component, route }">
        <Transition name="page">
          <div :key="route.path" class="col-start-1 row-start-1 h-full">
            <component :is="Component" />
          </div>
        </Transition>
      </router-view>
    </main>
    <CbToaster />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CbSidebar from './components/organisms/CbSidebar.vue'
import CbToaster from './components/atoms/CbToaster.vue'
import { startPeopleBroadcast } from './presence/usePeopleBroadcast'

const route = useRoute()

// The area is the page name without the slash, e.g. "/images" -> "images".
const myArea = computed(() => route.path.slice(1))

startPeopleBroadcast(myArea)
</script>

<style scoped>
/* The space for the scrollbar is always reserved, so a long page does not
   push the content sideways when its scrollbar appears. */
main {
  scrollbar-gutter: stable;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}

/* While a page slides in, it sticks out below the screen for a moment. Without
   clipping, the browser shows a scrollbar for the whole animation. */
main:has(.page-enter-active),
main:has(.page-leave-active) {
  overflow: hidden;
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
