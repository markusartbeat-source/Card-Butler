<template>
  <!-- The window for choosing an export format and, after that, for the
       settings of the chosen format. -->
  <!-- The format list keeps the size a dialog has everywhere in the app. The
       PNG step is 1320 × 784 px, the 1318 × 785 px of the Figma design on the
       nearest Tailwind step, and holds its parts 24 px apart instead of 48. -->
  <CbDialog
    v-if="!isExporting"
    ref="dialog"
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
      <CbExportCardGrid
        class="animate-cb-rise min-h-0"
        :style="riseDelay(0)"
        :cards="cards"
      />

      <CbExportSettingsPanel
        class="animate-cb-rise"
        :style="riseDelay(1)"
        @update:dpi="exportDpi = $event"
      />
    </div>

    <!-- In the format list the export button has nothing to export yet, so it
         stays disabled. In the PNG step it names how many cards go into the
         export and how large they become, and starts it. -->
    <template #footer>
      <CbButton variant="secondary" @click="leaveDialogOrStep">
        {{ step === 'formats' ? dictionary.general.cancel : dictionary.general.back }}
      </CbButton>

      <CbButton :disabled="step === 'formats'" @click="exportCards">
        {{
          step === 'formats'
            ? dictionary.project.export
            : dictionary.exportDialog.pngExportButton(cards.length, exportSize)
        }}
      </CbButton>
    </template>
  </CbDialog>

  <!-- Out of sight, in real size: this is what gets photographed. It has to
       stay in the page until the last card is done, long after the dialog
       itself has flown away. -->
  <CbExportRenderStage v-if="open || isExporting" ref="renderStage" :cards="cards" />

  <!-- The empty dialog box on its way into the toast corner. -->
  <CbExportDialogFlight
    v-if="flightStartRect"
    :start-rect="flightStartRect"
    @arrived="finishFlight"
  />
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'
import CbExportCardGrid from './CbExportCardGrid.vue'
import CbExportDialogFlight from './CbExportDialogFlight.vue'
import CbExportSettingsPanel from './CbExportSettingsPanel.vue'
import CbExportRenderStage from './png/CbExportRenderStage.vue'
import { cardToPngBlob, defaultExportDpi } from './png/exportPng'
import { packCardsIntoZip, saveZipFile } from './png/exportZip'
import {
  reportExportedCard,
  showExportDoneToast,
  startExportProgressToast,
  waitForFullBar,
} from './exportToast'
import type { ExportCard } from './exportCard'

const props = defineProps<{ open: boolean; cards: ExportCard[] }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const step = ref<'formats' | 'png'>('formats')

// The size of the export in MB. Measured on real cards, see measureExportSize.
const exportSize = ref(0)

// The hidden cards in real size, the ones that get photographed.
const renderStage = ref<InstanceType<typeof CbExportRenderStage>>()

// The dialog itself, so its box can be measured for the flight.
const dialog = ref<InstanceType<typeof CbDialog>>()

// True from the click on the export button until the file is saved. The dialog
// is off the page for that whole time, the toast in the corner tells the story.
const isExporting = ref(false)

// Where the flying box starts. Only set while it is on its way.
const flightStartRect = ref<DOMRect | null>(null)
let reportFlightArrived: (() => void) | undefined

// The toast in the corner that shows the progress.
const progressToastId = ref('')

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

// Sends the empty dialog box into the toast corner and tells the dialog it is
// closed while it is on its way. Answers as soon as the box has arrived.
function flyIntoToastCorner() {
  const box = dialog.value?.boxElement
  isExporting.value = true
  emit('update:open', false)

  if (!box) return Promise.resolve()

  flightStartRect.value = box.getBoundingClientRect()
  return new Promise<void>((arrived) => {
    reportFlightArrived = arrived
  })
}

function finishFlight() {
  flightStartRect.value = null
  reportFlightArrived?.()
}

// Packs every card into a zip and lets the browser download it. nextTick waits
// until the hidden stage is really in the page. The dialog leaves first: it
// flies into the corner, and the toast that takes its place there tells how far
// the export has come.
async function exportCards() {
  await nextTick()

  const stageElement = renderStage.value?.stageElement
  if (!stageElement) return

  await flyIntoToastCorner()
  progressToastId.value = startExportProgressToast(props.cards.length)

  const zipFile = await packCardsIntoZip(cardZipEntries(Array.from(stageElement.children)))

  // The file is only handed to the browser once the bar has really arrived at
  // the end, so the download window never turns up ahead of it.
  await waitForFullBar()
  saveZipFile(zipFile, dictionary.exportDialog.pngZipFileName)

  showExportDoneToast(progressToastId.value)
  isExporting.value = false
}

// Photographs the cards of the hidden stage one after another, never the small
// ones from the visible grid, and hands each finished picture straight to the
// zip. Inside the zip they lie in a folder named after the card set.
async function* cardZipEntries(stageCards: Element[]) {
  for (const [position, stageCard] of stageCards.entries()) {
    const cardImage = await cardToPngBlob(stageCard, exportDpi.value)
    reportExportedCard(position + 1)

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
