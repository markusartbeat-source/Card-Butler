<template>
  <!-- Die Abschnitte in der Reihenfolge aus Figma. -->
  <CbElementSettingsPanel :element-id="elementId" :title="dictionary.cardEditor.pictureSettings">
    <CbPictureAppearanceSettings :element-id="elementId" :card="card" />
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
import type { Card } from '../../cardSets/cardSets'
import CbPictureAppearanceSettings from './CbPictureAppearanceSettings.vue'

// card ist die Karte, die gerade im Editor offen ist.
defineProps<{ elementId: string; card: Card }>()
</script>
