<template>
  <div class="flex min-h-full flex-col">
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.support.title">
        <!-- Image row: a dark box in the photo's shape until the real image
             arrives. The width comes from the panel, the height follows. -->
        <div class="animate-cb-rise border-b-0 px-6 pt-6" :style="riseDelay(0)">
          <div class="support-image-placeholder w-full rounded-2xl bg-background"></div>
        </div>

        <!-- Feedback row -->
        <div class="flex flex-col gap-3 p-6">
          <h3 class="animate-cb-rise text-sm text-white" :style="riseDelay(1)">
            {{ dictionary.support.feedbackHeading }}
          </h3>
          <CbTextarea
            v-model="feedbackText"
            :label="dictionary.support.feedbackHeading"
            :placeholder="dictionary.support.feedbackPlaceholder"
            class="animate-cb-rise"
            :style="riseDelay(2)"
          />
        </div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbTextarea from '../components/atoms/CbTextarea.vue'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.general.support, searchbar: false }))

// What the user wants to tell us. Only page state, no backend yet.
const feedbackText = ref('')

// Every row waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom — the same feel as the share project page.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>

<style scoped>
/* The photo's shape from the design (582 × 125). */
.support-image-placeholder {
  aspect-ratio: 582 / 125;
}
</style>
