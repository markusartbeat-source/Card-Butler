<template>
  <div class="bg-background flex min-h-screen">
    <CbSidebar />
    <main class="relative flex-1 p-3">
      <router-view v-slot="{ Component, route }">
        <Transition name="page">
          <div :key="route.path">
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
.page-enter-active,
.page-leave-active {
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}

/* The leaving page is taken out of the flow so both pages overlap instead of
   pushing each other around. Inset matches the padding of <main>. */
.page-leave-active {
  position: absolute;
  inset: 0.75rem;
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
