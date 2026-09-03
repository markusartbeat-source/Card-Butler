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

    <CbDivider class="my-6" />

    <div class="flex flex-col gap-3">
      <h3 class="text-base font-bold text-white">{{ dictionary.exportDialog.cardSidesGroup }}</h3>

      <div class="flex flex-col">
        <CbCheckbox
          v-for="cardSide in cardSides"
          :key="cardSide.key"
          v-model="chosenCardSides[cardSide.key]"
          :label="cardSide.label"
        />
      </div>
    </div>

    <CbDivider class="my-6" />

    <div class="flex flex-col gap-3">
      <h3 class="text-base font-bold text-white">{{ dictionary.exportDialog.imageQualityGroup }}</h3>
      <CbSelect v-model="chosenResolution" variant="field" :items="resolutionOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import CbCheckbox from '../components/atoms/CbCheckbox.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import { defaultExportDpi } from './png/exportPng'

const emit = defineEmits<{ 'update:dpi': [dpi: number] }>()

// Invented card sets — the export does not look at the real project yet, and
// ticking a box changes nothing.
const cardSets = computed(() => [
  { key: 'one' as const, label: dictionary.exportDialog.cardSetOne },
  { key: 'two' as const, label: dictionary.exportDialog.cardSetTwo },
  { key: 'three' as const, label: dictionary.exportDialog.cardSetThree },
])

const chosenCardSets = ref({ one: true, two: true, three: false })

const cardSides = computed(() => [
  { key: 'fronts' as const, label: dictionary.exportDialog.cardFronts },
  { key: 'backs' as const, label: dictionary.exportDialog.cardBacks },
])

const chosenCardSides = ref({ fronts: true, backs: true })

// What each resolution is for, in the words of the person exporting. The number
// decides how many pixels a card becomes, so it stands in the entry as well.
const resolutions = computed(() => [
  { dpi: 96, purpose: dictionary.exportDialog.imageQualityScreen },
  { dpi: 150, purpose: dictionary.exportDialog.imageQualityTabletop },
  { dpi: defaultExportDpi, purpose: dictionary.exportDialog.imageQualityPrint },
  { dpi: 600, purpose: dictionary.exportDialog.imageQualityFinePrint },
])

const resolutionOptions = computed(() =>
  resolutions.value.map(({ dpi, purpose }) => ({
    value: String(dpi),
    label: dictionary.exportDialog.imageQualityOption(purpose, dpi),
  })),
)

// The select works with text, the export with a number.
const chosenResolution = ref(String(defaultExportDpi))
const chosenDpi = computed(() => Number(chosenResolution.value))

// The chosen resolution decides how fine the exported pictures become.
watchEffect(() => emit('update:dpi', chosenDpi.value))
</script>
