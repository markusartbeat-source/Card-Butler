<template>
  <!-- Die Kontur der Form: Farbe und Stärke in mm. Sie liegt innen, Stärke 0
       heißt keine Kontur – weniger wird begrenzt. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.borderGroup }}</CbSettingsHeading>
    <CbColorPicker
      v-model="color"
      :label="dictionary.cardEditor.borderColor"
      @change="(value) => changeBorder(elementId, { color: value })"
    />
    <CbNumberInput
      :value="border.width"
      icon="line_weight"
      :label="dictionary.cardEditor.borderWidth"
      @commit="(millimeters) => changeBorder(elementId, { width: Math.max(millimeters, 0) })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbColorPicker from '../../components/atoms/CbColorPicker.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbNumberInput from '../../components/molecules/CbNumberInput.vue'
import { findCardSetElement } from '../cardElements'
import { changeBorder, previewBorder, shapeAppearanceOf } from './shapeAppearance'

const props = defineProps<{ elementId: string }>()

const border = computed(() => shapeAppearanceOf(findCardSetElement(props.elementId)?.data).border)

// Beim Ziehen nur zeigen, gespeichert wird bei change.
const color = computed({
  get: () => border.value.color,
  set: (value) => previewBorder(props.elementId, { color: value }),
})
</script>
