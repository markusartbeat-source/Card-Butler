<template>
  <!-- The window for choosing an export format. -->
  <CbDialog
    :open="open"
    :title="dictionary.project.export"
    @update:open="$emit('update:open', $event)"
  >
    <!-- gap-8 between the groups, the same distance the settings page keeps
         between its groups. -->
    <div class="flex flex-col gap-8">
      <CbSettingsGroup :title="dictionary.exportDialog.digitalGroup">
        <CbSettingsRow
          interactive
          :title="dictionary.exportDialog.png"
          :info="dictionary.exportDialog.pngInfo"
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

    <!-- The export button does nothing yet, it gets its disabled look in the
         next step. -->
    <template #footer>
      <CbButton variant="secondary" @click="$emit('update:open', false)">
        {{ dictionary.general.cancel }}
      </CbButton>

      <CbButton>{{ dictionary.project.export }}</CbButton>
    </template>
  </CbDialog>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'

defineProps<{ open: boolean }>()
defineEmits<{ 'update:open': [open: boolean] }>()
</script>
