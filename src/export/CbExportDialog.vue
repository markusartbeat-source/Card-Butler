<template>
  <!-- The window for choosing an export format. The print formats and the
       buttons come in the next steps. -->
  <CbDialog
    :open="open"
    :title="dictionary.project.export"
    @update:open="$emit('update:open', $event)"
  >
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
  </CbDialog>
</template>

<script setup lang="ts">
import CbDialog from '../components/atoms/CbDialog.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSettingsRow from '../components/atoms/CbSettingsRow.vue'

defineProps<{ open: boolean }>()
defineEmits<{ 'update:open': [open: boolean] }>()
</script>
