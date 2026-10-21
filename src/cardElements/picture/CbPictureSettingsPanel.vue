<template>
  <!-- Die Abschnitte in der Reihenfolge aus Figma. -->
  <CbElementSettingsPanel :element-id="elementId" :title="dictionary.cardEditor.pictureSettings">
    <CbPictureAppearanceSettings :element-id="elementId" />
    <CbDivider />
    <CbElementCornerRadiusSettings :element-id="elementId" />
    <CbDivider />
    <CbElementPositionSettings :element-id="elementId" />
  </CbElementSettingsPanel>
</template>

<script setup lang="ts">
import CbDivider from '../../components/atoms/CbDivider.vue'
import CbElementCornerRadiusSettings from '../CbElementCornerRadiusSettings.vue'
import CbElementPositionSettings from '../CbElementPositionSettings.vue'
import CbElementSettingsPanel from '../CbElementSettingsPanel.vue'
import CbPictureAppearanceSettings from './CbPictureAppearanceSettings.vue'

defineProps<{ elementId: string }>()
</script>
