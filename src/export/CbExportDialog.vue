<template>
  <!-- The window for choosing an export format and, after that, for the
       settings of the chosen format. -->
  <!-- The format list keeps the size a dialog has everywhere in the app. The
       PNG step is 1320 × 784 px, the 1318 × 785 px of the Figma design on the
       nearest Tailwind step, and holds its parts 24 px apart instead of 48. -->
  <CbDialog
    :open="open"
    :title="step === 'formats' ? dictionary.project.export : dictionary.exportDialog.pngTitle"
    :size-class="step === 'formats' ? 'w-172' : 'h-196 w-330'"
    :panel-class="step === 'formats' ? 'gap-12' : 'gap-6'"
    @update:open="$emit('update:open', $event)"
  >
    <template v-if="step === 'png'" #titleStart>
      <CbButton
        variant="ghost"
        :aria-label="dictionary.general.back"
        @click="goToStep('formats')"
      >
        <CbIcon name="west" />
      </CbButton>
    </template>

    <!-- gap-8 between the groups, the same distance the settings page keeps
         between its groups. -->
    <div v-if="step === 'formats'" class="flex flex-col gap-8">
      <CbSettingsGroup
        class="animate-cb-rise"
        :style="riseDelay(0)"
        :title="dictionary.exportDialog.digitalGroup"
      >
        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.png"
          :info="dictionary.exportDialog.pngInfo"
          @click="goToStep('png')"
        >
          <CbIcon name="east" />
        </CbSettingsRow>

        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.tableTopSimulator"
          :info="dictionary.exportDialog.tableTopSimulatorInfo"
        >
          <CbIcon name="east" />
        </CbSettingsRow>

        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.boardGameArena"
          :info="dictionary.exportDialog.boardGameArenaInfo"
        >
          <CbIcon name="east" />
        </CbSettingsRow>
      </CbSettingsGroup>

      <CbSettingsGroup
        class="animate-cb-rise"
        :style="riseDelay(1)"
        :title="dictionary.exportDialog.printGroup"
      >
        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.pdf"
          :info="dictionary.exportDialog.pdfInfo"
        >
          <CbIcon name="east" />
        </CbSettingsRow>
      </CbSettingsGroup>
    </div>

    <!-- Left the cards, right the export settings. grow fills the whole space
         of the taller dialog, so the footer stays at the bottom edge; min-h-0
         lets both sides scroll inside it instead of pushing the dialog open. -->
    <div v-else class="flex min-h-0 grow gap-6">
      <!-- The cards stay in view the whole time; while the export runs, the bar
           and its count come up underneath them. -->
      <div class="flex min-h-0 min-w-0 grow flex-col items-center gap-2">
        <CbExportCardGrid
          class="animate-cb-rise min-h-0"
          :style="riseDelay(0)"
          :cards="cards"
        />

        <template v-if="exportingCardNumber">
          <CbProgress :value="finishedCardCount" :max="cards.length" />
          <span class="text-2xs text-label">
            {{ dictionary.exportDialog.pngExportProgress(exportingCardNumber, cards.length) }}
          </span>
        </template>
      </div>
      <CbExportSettingsPanel
        class="animate-cb-rise"
        :style="riseDelay(1)"
        @update:dpi="exportDpi = $event"
      />

      <!-- Out of sight, in real size: this is what gets photographed. -->
      <CbExportRenderStage ref="renderStage" :cards="cards" />
    </div>

    <!-- In the format list the export button has nothing to export yet, so it
         stays disabled. In the PNG step it names how many cards go into the
         export and how large they become, and starts it. -->
    <template #footer>
      <CbButton variant="secondary" @click="leaveDialogOrStep">
        {{ step === 'formats' ? dictionary.general.cancel : dictionary.general.back }}
      </CbButton>

      <CbButton
        :disabled="step === 'formats' || exportingCardNumber > 0"
        @click="exportCards"
      >
        {{
          step === 'formats'
            ? dictionary.project.export
            : dictionary.exportDialog.pngExportButton(cards.length, exportSize)
        }}
      </CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProgress from '../components/atoms/CbProgress.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'
import CbExportCardGrid from './CbExportCardGrid.vue'
import CbExportSettingsPanel from './CbExportSettingsPanel.vue'
import CbExportRenderStage from './png/CbExportRenderStage.vue'
import { cardToPngBlob, defaultExportDpi } from './png/exportPng'
import { downloadCardsZip } from './png/exportZip'
import type { ExportCard } from './exportCard'

const props = defineProps<{ open: boolean; cards: ExportCard[] }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const step = ref<'formats' | 'png'>('formats')

// The size of the export in MB. Measured on real cards, see measureExportSize.
const exportSize = ref(0)

// The hidden cards in real size, the ones that get photographed.
const renderStage = ref<InstanceType<typeof CbExportRenderStage>>()

// Which card is being photographed right now, counted from 1. 0 means the
// export is not running. The finished ones fill the progress bar.
const exportingCardNumber = ref(0)
const finishedCardCount = ref(0)

// The chosen resolution. The settings panel says its own number as soon as the
// PNG step is there.
const exportDpi = ref(defaultExportDpi)

const bytesPerMegabyte = 1024 * 1024

// What a resolution turned out to weigh, so picking it again answers at once.
const measuredSizes = new Map<number, number>()

// How large the export becomes. Nobody can know that beforehand: PNG squeezes
// the picture, and how well depends on what is on the card. So one card is
// really exported and counts for all of them. Later, with several card sets,
// it will be one card per set.
async function measureExportSize(dpi: number) {
  const remembered = measuredSizes.get(dpi)
  if (remembered !== undefined) {
    exportSize.value = remembered
    return
  }

  await nextTick()
  const stageCards = Array.from(renderStage.value?.stageElement?.children ?? [])
  if (!stageCards.length) return

  const sampleImage = await cardToPngBlob(stageCards[0], dpi)

  // Clicking through the resolutions starts a measurement each time; only the
  // one that is still chosen may write its number.
  if (dpi !== exportDpi.value) return

  const megabytes = (sampleImage.size / bytesPerMegabyte) * stageCards.length
  const rounded = Math.round(megabytes * 10) / 10
  measuredSizes.set(dpi, rounded)
  exportSize.value = rounded
}

// The size is measured on the hidden stage, which stands in the page only in
// the PNG step, and again for every resolution that is picked there.
watch([step, exportDpi], ([currentStep, dpi]) => {
  if (currentStep === 'png') measureExportSize(dpi)
})

// Packs every card into a zip and lets the browser download it. nextTick waits
// until the hidden stage is really in the page. Once the file is on its way,
// the dialog has nothing left to show and closes.
async function exportCards() {
  finishedCardCount.value = 0
  exportingCardNumber.value = 0
  await nextTick()

  const stageElement = renderStage.value?.stageElement
  if (!stageElement) return

  await downloadCardsZip(
    cardZipEntries(Array.from(stageElement.children)),
    dictionary.exportDialog.pngZipFileName,
  )

  exportingCardNumber.value = 0
  emit('update:open', false)
}

// Photographs the cards of the hidden stage one after another, never the small
// ones from the visible grid, and hands each finished picture straight to the
// zip. Inside the zip they lie in a folder named after the card set.
async function* cardZipEntries(stageCards: Element[]) {
  for (const [position, stageCard] of stageCards.entries()) {
    exportingCardNumber.value = position + 1

    const cardImage = await cardToPngBlob(stageCard, exportDpi.value)
    finishedCardCount.value = position + 1

    // Hand the screen over to drawing once, otherwise the bar would only jump
    // from empty to full at the very end.
    await new Promise((paint) => requestAnimationFrame(paint))

    const cardNumber = String(position + 1).padStart(2, '0')
    yield {
      name: `${dictionary.exportDialog.cardSetOne}/${dictionary.exportDialog.pngCardFileName(cardNumber)}`,
      input: cardImage,
    }
  }
}

// How long the parts of a step wait before they come in. On a step change the
// dialog first grows into its new size — 350 ms, the same time as everywhere
// else — and the new content would otherwise fade in inside the box of the old
// step. A freshly opened dialog grows nowhere, so there its parts start at once.
const dialogResizeDuration = 350
const contentDelay = ref(0)

// Every part waits a moment longer than the one before it, so a step builds
// itself up instead of appearing all at once.
function riseDelay(position: number) {
  return { animationDelay: `${contentDelay.value + position * 60}ms` }
}

// The dialog always opens on the format list. Resetting on the way in, not on
// the way out, keeps the closing dialog from jumping back a step while it
// fades away.
watch(
  () => props.open,
  (open) => {
    if (!open) return
    step.value = 'formats'
    contentDelay.value = 0
    finishedCardCount.value = 0
    exportingCardNumber.value = 0

    // The cards may have been edited since the last time, so the remembered
    // sizes are worth nothing.
    measuredSizes.clear()
    exportSize.value = 0
  },
)

function goToStep(next: 'formats' | 'png') {
  contentDelay.value = dialogResizeDuration
  step.value = next
}

// The left button is the way out of the current step: back to the format list,
// or out of the dialog if that list is already showing.
function leaveDialogOrStep() {
  if (step.value === 'formats') emit('update:open', false)
  else goToStep('formats')
}
</script>
