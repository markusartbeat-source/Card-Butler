<template>
  <!-- Der Strich der Form: Farbe, Stärke in mm und Linienart. Beim Viereck und
       Kreis ist es die Kontur, sie liegt innen, Stärke 0 heißt keine Kontur –
       weniger wird begrenzt. Bei der Linie ist es die Linie selbst, dazu ihre
       Deckkraft. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ labels.group }}</CbSettingsHeading>
    <CbColorPicker
      v-model="color"
      :label="labels.color"
      @change="(value) => changeStroke(elementId, { color: value })"
    />
    <CbElementOpacityField v-if="isLine" :element-id="elementId" />
    <div class="grid grid-cols-2 gap-3">
      <CbNumberInput
        :value="stroke.width"
        icon="line_weight"
        :label="labels.width"
        @commit="(millimeters) => changeStroke(elementId, { width: Math.max(millimeters, 0) })"
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
import CbElementOpacityField from '../CbElementOpacityField.vue'
import { findCardSetElement } from '../cardElements'
import { changeStroke, previewStroke, strokeOf } from './shapeAppearance'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)

const stroke = computed(() => strokeOf(data.value))

const isLine = computed(() => data.value?.type === 'LINE')

const labels = computed(() =>
  isLine.value
    ? {
        group: dictionary.cardEditor.lineGroup,
        color: dictionary.cardEditor.lineColor,
        width: dictionary.cardEditor.lineWidth,
      }
    : {
        group: dictionary.cardEditor.borderGroup,
        color: dictionary.cardEditor.borderColor,
        width: dictionary.cardEditor.borderWidth,
      },
)

// Beim Ziehen nur zeigen, gespeichert wird bei change.
const color = computed({
  get: () => stroke.value.color,
  set: (value) => previewStroke(props.elementId, { color: value }),
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
  get: () => lineTypes.value.findIndex((item) => item.lineType === stroke.value.lineType),
  set: (index) => changeStroke(props.elementId, { lineType: lineTypes.value[index].lineType }),
})
</script>
