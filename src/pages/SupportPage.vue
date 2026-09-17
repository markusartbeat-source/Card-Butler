<template>
  <!-- The spacers share the free height 2:3 — see ShareProjectPage. -->
  <div class="flex min-h-full flex-col">
    <div class="grow-2"></div>
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.support.title">
        <!-- Image row: the same shape as on the share page. Decorative only,
             so the alt text stays empty. -->
        <div class="animate-cb-rise border-b-0 px-6 pt-6" :style="riseDelay(0)">
          <img
            src="../assets/visuals/Support.png"
            alt=""
            class="support-image w-full rounded-2xl object-cover"
          />
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

        <!-- Contact row: each checkbox carries its own 6 px of padding, so the
             rows need no gap of their own. -->
        <div class="flex flex-col p-6 text-white">
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

        <!-- Submit row: the button sits on the right, as in the design. -->
        <div class="flex justify-end p-6">
          <CbButton class="animate-cb-rise w-24" :style="riseDelay(7)" @click="sendFeedback">
            {{ dictionary.support.submit }}
          </CbButton>
        </div>
      </CbSettingsGroup>
    </div>
    <div class="grow-3"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbCheckbox from '../components/atoms/CbCheckbox.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbInteractive from '../components/atoms/CbInteractive.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbTextarea from '../components/atoms/CbTextarea.vue'
import { useHeader } from '../components/organisms/headerState'
import { showSuccessToast } from '../components/atoms/toaster'

useHeader(() => ({ title: dictionary.general.support, searchbar: false }))

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

// No backend yet: thanks the user and clears the form. The hidden input is
// reset too, so picking the same files again fires its change event.
function sendFeedback() {
  showSuccessToast(dictionary.support.sentToast)
  feedbackText.value = ''
  screenshots.value = []
  if (screenshotInput.value) screenshotInput.value.value = ''
}

// Every row waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom — the same feel as the share project page.
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
