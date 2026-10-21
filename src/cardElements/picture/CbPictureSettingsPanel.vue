<template>
  <!-- Die Abschnitte in der Reihenfolge aus Figma. -->
  <CbElementSettingsPanel :element-id="elementId" :title="dictionary.cardEditor.pictureSettings">
    <CbElementPositionSettings :element-id="elementId" />
  </CbElementSettingsPanel>
</template>

<script setup lang="ts">
import CbElementPositionSettings from '../CbElementPositionSettings.vue'
import CbElementSettingsPanel from '../CbElementSettingsPanel.vue'

defineProps<{ elementId: string }>()
</script>
