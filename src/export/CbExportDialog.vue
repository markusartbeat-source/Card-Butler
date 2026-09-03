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
      <CbButton variant="ghost" :aria-label="dictionary.general.back" @click="step = 'formats'">
        <CbIcon name="west" />
      </CbButton>
    </template>

    <!-- gap-8 between the groups, the same distance the settings page keeps
         between its groups. -->
    <div v-if="step === 'formats'" class="animate-cb-rise flex flex-col gap-8">
      <CbSettingsGroup :title="dictionary.exportDialog.digitalGroup">
        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.png"
          :info="dictionary.exportDialog.pngInfo"
          @click="step = 'png'"
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

      <CbSettingsGroup :title="dictionary.exportDialog.printGroup">
        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.pdf"
          :info="dictionary.exportDialog.pdfInfo"
        >
          <CbIcon name="east" />
        </CbSettingsRow>
      </CbSettingsGroup>
    </div>

    <!-- Left the cards, right the export settings that still have to move in
         here. grow fills the whole space of the taller dialog, so the footer
         stays at the bottom edge; min-h-0 lets the card grid scroll inside it
         instead of pushing the dialog open. -->
    <div v-else class="animate-cb-rise flex min-h-0 grow gap-6">
      <CbExportCardGrid :cards="cards" />
    </div>

    <!-- In the format list the export button has nothing to export yet, so it
         stays disabled. In the PNG step it shows the size of the export and
         does nothing yet. -->
    <template #footer>
      <CbButton variant="secondary" @click="leaveStep">
        {{ step === 'formats' ? dictionary.general.cancel : dictionary.general.back }}
      </CbButton>

      <CbButton :disabled="step === 'formats'">
        {{ step === 'formats' ? dictionary.project.export : dictionary.exportDialog.pngExportButton }}
      </CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'
import CbExportCardGrid from './CbExportCardGrid.vue'
import type { ExportCard } from './exportCard'

const props = defineProps<{ open: boolean; cards: ExportCard[] }>()
const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const step = ref<'formats' | 'png'>('formats')

// The dialog always opens on the format list. Resetting on the way in, not on
// the way out, keeps the closing dialog from jumping back a step while it
// fades away.
watch(
  () => props.open,
  (open) => {
    if (open) step.value = 'formats'
  },
)

// The left button is the way out of the current step: back to the format list,
// or out of the dialog if that list is already showing.
function leaveStep() {
  if (step.value === 'formats') emit('update:open', false)
  else step.value = 'formats'
}
</script>
