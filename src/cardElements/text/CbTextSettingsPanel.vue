<template>
  <!-- Die Abschnitte in der Reihenfolge aus Figma. -->
  <CbElementSettingsPanel :element-id="elementId" :title="dictionary.cardEditor.textSettings">
    <CbTextboxSettings :element-id="elementId" />
    <CbDivider />
    <CbElementPositionSettings :element-id="elementId" />
  </CbElementSettingsPanel>
</template>

<script setup lang="ts">
import CbDivider from '../../components/atoms/CbDivider.vue'
import CbElementPositionSettings from '../CbElementPositionSettings.vue'
import CbElementSettingsPanel from '../CbElementSettingsPanel.vue'
import CbTextboxSettings from './CbTextboxSettings.vue'

defineProps<{ elementId: string }>()
</script>
