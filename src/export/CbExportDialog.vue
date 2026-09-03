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
      <!-- Once the cards have been photographed, the finished pictures take the
           place of the grid, laid out like it. Below them stands the pixel size
           as a temporary check — it goes away again at the end of the export
           work. -->
      <div
        v-if="exportingCardNumber || previewUrls.length"
        class="flex min-h-0 min-w-0 grow flex-col items-center gap-2"
      >
        <!-- grow holds the pictures in the whole free space, so the bar below
             stays put while more and more of them come in. -->
        <div class="flex min-h-0 grow flex-wrap content-start justify-center gap-3 overflow-y-auto">
          <img
            v-for="(url, position) in previewUrls"
            :key="position"
            :src="url"
            :alt="dictionary.exportDialog.pngPreviewAlt"
            :style="previewWidthStyle"
          />
        </div>

        <!-- While the export runs, the bar and its count take the place of the
             pixel size. -->
        <template v-if="exportingCardNumber">
          <CbProgress :value="previewUrls.length" :max="cards.length" />
          <span class="text-2xs text-label">
            {{ dictionary.exportDialog.pngExportProgress(exportingCardNumber, cards.length) }}
          </span>
        </template>
        <span v-else class="text-2xs text-label">{{ previewPixelSize }}</span>
      </div>
      <CbExportCardGrid
        v-else
        class="animate-cb-rise"
        :style="riseDelay(0)"
        :cards="cards"
      />
      <CbExportSettingsPanel
        class="animate-cb-rise"
        :style="riseDelay(1)"
        @update:export-size="exportSize = $event"
        @update:dpi="exportDpi = $event"
      />

      <!-- Out of sight, in real size: this is what gets photographed. -->
      <CbExportRenderStage ref="renderStage" :cards="cards" />
    </div>

    <!-- In the format list the export button has nothing to export yet, so it
         stays disabled. In the PNG step it shows the size the settings panel
         reports and starts the export. -->
    <template #footer>
      <CbButton variant="secondary" @click="leaveDialogOrStep">
        {{ step === 'formats' ? dictionary.general.cancel : dictionary.general.back }}
      </CbButton>

      <CbButton :disabled="step === 'formats'" @click="exportCards">
        {{
          step === 'formats'
            ? dictionary.project.export
            : dictionary.exportDialog.pngExportButton(exportSize)
        }}
      </CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProgress from '../components/atoms/CbProgress.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'
import { cardFormat, exportZoom } from '../card/cardFormat'
import CbExportCardGrid from './CbExportCardGrid.vue'
import CbExportSettingsPanel from './CbExportSettingsPanel.vue'
import CbExportRenderStage from './png/CbExportRenderStage.vue'
import {
  cardPixelSize,
  cardToPngUrl,
  defaultImageQuality,
  dpiForImageQuality,
} from './png/exportPng'
import type { ExportCard } from './exportCard'

const props = defineProps<{ open: boolean; cards: ExportCard[] }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const step = ref<'formats' | 'png'>('formats')

// The size of the export in MB. The settings panel says the real number as soon
// as the PNG step is there.
const exportSize = ref(50)

// The finished pictures, shown until the export really writes a file.
const renderStage = ref<InstanceType<typeof CbExportRenderStage>>()
const previewUrls = ref<string[]>([])

// Which card is being photographed right now, counted from 1. 0 means the
// export is not running.
const exportingCardNumber = ref(0)

// A picture is shown as wide as a card in the grid next to it.
const previewWidthStyle = computed(() => ({
  width: `${cardFormat.value.width * exportZoom}mm`,
}))

// The resolution the quality slider stands for. The settings panel says its own
// number as soon as the PNG step is there.
const exportDpi = ref(dpiForImageQuality(defaultImageQuality))

// The size of the finished picture, e.g. "744 × 1039 px".
const previewPixelSize = computed(() => {
  const { width, height } = cardPixelSize(exportDpi.value)
  return `${width} × ${height} px`
})

// Photographs the cards of the hidden stage one after another, never the small
// ones from the visible grid. nextTick waits until the stage is really in the
// page.
async function exportCards() {
  previewUrls.value = []
  exportingCardNumber.value = 0
  await nextTick()

  const stageElement = renderStage.value?.stageElement
  if (!stageElement) return

  const stageCards = Array.from(stageElement.children)
  for (const [position, stageCard] of stageCards.entries()) {
    exportingCardNumber.value = position + 1
    previewUrls.value.push(await cardToPngUrl(stageCard, exportDpi.value))

    // Hand the screen over to drawing once, otherwise the bar would only jump
    // from empty to full at the very end.
    await new Promise((paint) => requestAnimationFrame(paint))
  }

  exportingCardNumber.value = 0
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
    previewUrls.value = []
    exportingCardNumber.value = 0
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
