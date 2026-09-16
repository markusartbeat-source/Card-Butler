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

        <!-- Screenshot row: the dashed tile opens the hidden file picker. -->
        <div class="flex flex-col gap-3 p-6">
          <h3 class="animate-cb-rise text-sm text-white" :style="riseDelay(3)">
            {{ dictionary.support.screenshotHeading }}
          </h3>
          <CbInteractive
            class="animate-cb-rise flex w-28 flex-col items-center gap-2.5 rounded-md border-2 border-dashed border-label py-4 text-sm text-label"
            :style="riseDelay(4)"
            @click="screenshotInput?.click()"
          >
            <CbIcon name="filter" />
            <span>{{ dictionary.support.screenshotTile }}</span>
          </CbInteractive>
          <input
            ref="screenshotInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="pickScreenshots"
          />
          <p v-for="file in screenshots" :key="file.name" class="text-sm text-label">
            {{ file.name }}
          </p>
        </div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbTextarea from '../components/atoms/CbTextarea.vue'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.general.support, searchbar: false }))

// What the user wants to tell us. Only page state, no backend yet.
const feedbackText = ref('')

// The chosen screenshots. The real input stays hidden, the tile clicks it.
const screenshotInput = useTemplateRef<HTMLInputElement>('screenshotInput')
const screenshots = ref<File[]>([])

function pickScreenshots(event: Event) {
  screenshots.value = Array.from((event.target as HTMLInputElement).files ?? [])
}

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
