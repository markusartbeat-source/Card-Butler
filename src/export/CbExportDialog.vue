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
      <!-- Once a card has been photographed, the finished picture takes the
           place of the grid. -->
      <img
        v-if="previewUrl"
        :src="previewUrl"
        :alt="dictionary.exportDialog.pngPreviewAlt"
        class="min-w-0 grow object-contain"
      />
      <CbExportCardGrid
        v-else
        ref="cardGrid"
        class="animate-cb-rise"
        :style="riseDelay(0)"
        :cards="cards"
      />
      <CbExportSettingsPanel
        class="animate-cb-rise"
        :style="riseDelay(1)"
        @update:export-size="exportSize = $event"
      />
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
import { nextTick, ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'
import CbExportCardGrid from './CbExportCardGrid.vue'
import CbExportSettingsPanel from './CbExportSettingsPanel.vue'
import { cardToPngUrl } from './png/exportPng'
import type { ExportCard } from './exportCard'

const props = defineProps<{ open: boolean; cards: ExportCard[] }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const step = ref<'formats' | 'png'>('formats')

// The size of the export in MB. The settings panel says the real number as soon
// as the PNG step is there.
const exportSize = ref(50)

// The picture of the first card, as long as the export is only a first try.
const cardGrid = ref<InstanceType<typeof CbExportCardGrid>>()
const previewUrl = ref('')

// Photographs the first card of the grid. Clearing the old picture first brings
// the grid back into the page, and nextTick waits until it is really there.
async function exportCards() {
  previewUrl.value = ''
  await nextTick()

  const firstCard = cardGrid.value?.gridElement?.firstElementChild
  if (!firstCard) return

  previewUrl.value = await cardToPngUrl(firstCard)
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
    previewUrl.value = ''
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
