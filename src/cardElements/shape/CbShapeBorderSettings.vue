<template>
  <!-- Die Kontur der Form: Farbe, Stärke in mm und Linienart. Sie liegt innen,
       Stärke 0 heißt keine Kontur – weniger wird begrenzt. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.borderGroup }}</CbSettingsHeading>
    <CbColorPicker
      v-model="color"
      :label="dictionary.cardEditor.borderColor"
      @change="(value) => changeBorder(elementId, { color: value })"
    />
    <div class="grid grid-cols-2 gap-3">
      <CbNumberInput
        :value="border.width"
        icon="line_weight"
        :label="dictionary.cardEditor.borderWidth"
        @commit="(millimeters) => changeBorder(elementId, { width: Math.max(millimeters, 0) })"
      />
      <CbToggleGroup
        v-model="lineTypeIndex"
        :label="dictionary.cardEditor.borderLineType"
        :items="lineTypes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbColorPicker from '../../components/atoms/CbColorPicker.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbNumberInput from '../../components/molecules/CbNumberInput.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'
import { findCardSetElement } from '../cardElements'
import { changeBorder, previewBorder, shapeAppearanceOf } from './shapeAppearance'

const props = defineProps<{ elementId: string }>()

const border = computed(() => shapeAppearanceOf(findCardSetElement(props.elementId)?.data).border)

// Beim Ziehen nur zeigen, gespeichert wird bei change.
const color = computed({
  get: () => border.value.color,
  set: (value) => previewBorder(props.elementId, { color: value }),
})

const lineTypes = computed(() => [
  {
    lineType: 'SOLID' as const,
    name: dictionary.cardEditor.borderSolid,
    icon: 'square' as const,
  },
  {
    lineType: 'DASHED' as const,
    name: dictionary.cardEditor.borderDashed,
    icon: 'select' as const,
  },
])

const lineTypeIndex = computed({
  get: () => lineTypes.value.findIndex((item) => item.lineType === border.value.lineType),
  set: (index) => changeBorder(props.elementId, { lineType: lineTypes.value[index].lineType }),
})
</script>
