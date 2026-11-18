<template>
  <!-- Nur ein Bereich, daher ohne eigene Überschrift und ohne Kasten: Bild und
       Formular stehen direkt im Dialog. -->
  <div class="flex flex-col gap-6">
    <!-- Image row: the same shape as in the share dialog. Decorative only,
         so the alt text stays empty. -->
    <img
      src="../assets/visuals/Support.png"
      alt=""
      class="support-image animate-cb-rise w-full rounded-2xl object-cover"
      :style="riseDelay(0)"
    />

    <!-- Feedback row -->
    <div class="flex flex-col gap-3">
      <h4 class="cb-regular-text animate-cb-rise" :style="riseDelay(1)">
        {{ dictionary.support.feedbackHeading }}
      </h4>
      <CbTextarea
        v-model="feedbackText"
        :label="dictionary.support.feedbackHeading"
        :placeholder="dictionary.support.feedbackPlaceholder"
        class="animate-cb-rise"
        :style="riseDelay(2)"
      />
    </div>

    <!-- Screenshot row: the dashed tile opens the hidden file picker. -->
    <div class="flex flex-col gap-3">
      <h4 class="cb-regular-text animate-cb-rise" :style="riseDelay(3)">
        {{ dictionary.support.screenshotHeading }}
      </h4>
      <CbInteractive
        class="cb-regular-text-muted animate-cb-rise flex w-28 flex-col items-center gap-2.5 rounded-md border-2 border-dashed border-label py-4"
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
      <p v-for="file in screenshots" :key="file.name" class="cb-regular-text-muted">
        {{ file.name }}
      </p>
    </div>

    <!-- Contact row: each checkbox carries its own 6 px of padding, so the
         rows need no gap of their own. -->
    <div class="flex flex-col">
      <CbCheckbox
        v-model="notifyAboutUpdates"
        :label="dictionary.support.notifyUpdatesCheckbox"
        class="animate-cb-rise"
        :style="riseDelay(5)"
      />
      <CbCheckbox
        v-model="allowContact"
        :label="dictionary.support.allowContactCheckbox"
        class="animate-cb-rise"
        :style="riseDelay(6)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CbCheckbox from '../components/atoms/CbCheckbox.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbTextarea from '../components/atoms/CbTextarea.vue'
import { showSuccessToast } from '../components/atoms/toaster'

// What the user wants to tell us. Only page state, no backend yet.
const feedbackText = ref('')

// The chosen screenshots. The real input stays hidden, the tile clicks it.
const screenshotInput = useTemplateRef<HTMLInputElement>('screenshotInput')
const screenshots = ref<File[]>([])

function pickScreenshots(event: Event) {
  screenshots.value = Array.from((event.target as HTMLInputElement).files ?? [])
}

// Both start ticked, as in the design.
const notifyAboutUpdates = ref(true)
const allowContact = ref(true)

// Abgeschickt wird über den Knopf im Footer (CbHeaderDialog), der den Dialog
// danach schließt – beim nächsten Öffnen ist das Formular darum wieder leer.
// Noch ohne Backend: nur der Dank an den Nutzer.
function sendFeedback() {
  showSuccessToast(dictionary.support.sentToast)
}
defineExpose({ sendFeedback })

// Every row waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom — the same feel as the share dialog.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>

<style scoped>
/* A little taller than the design's 582 × 125, so the photo gets more room. */
.support-image {
  aspect-ratio: 582 / 160;
}
</style>
