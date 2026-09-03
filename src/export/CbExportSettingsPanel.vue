<template>
  <!-- The settings of the PNG export, in the look of the card settings panel.
       317 px wide in the Figma design, w-79 is the nearest Tailwind step. -->
  <div class="w-79 shrink-0 overflow-y-auto rounded-2xl bg-surface p-6">
    <!-- Title framed by a short golden stroke on each side. -->
    <div class="flex items-center justify-center gap-3">
      <span class="h-px w-4.5 bg-gold"></span>
      <h2 class="text-xl text-white">{{ dictionary.exportDialog.settingsTitle }}</h2>
      <span class="h-px w-4.5 bg-gold"></span>
    </div>

    <div class="mt-6 flex flex-col gap-3">
      <h3 class="text-base font-bold text-white">{{ dictionary.exportDialog.whichCardsGroup }}</h3>

      <!-- The rows need no gap of their own: each one already carries 6 px of
           padding, which puts 12 px between two boxes. -->
      <div class="flex flex-col">
        <CbCheckbox
          v-for="cardSet in cardSets"
          :key="cardSet.key"
          v-model="chosenCardSets[cardSet.key]"
          :label="cardSet.label"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbCheckbox from '../components/atoms/CbCheckbox.vue'

// Invented card sets — the export does not look at the real project yet, and
// ticking a box changes nothing.
const cardSets = computed(() => [
  { key: 'one' as const, label: dictionary.exportDialog.cardSetOne },
  { key: 'two' as const, label: dictionary.exportDialog.cardSetTwo },
  { key: 'three' as const, label: dictionary.exportDialog.cardSetThree },
])

const chosenCardSets = ref({ one: true, two: true, three: false })
</script>
