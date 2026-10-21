<template>
  <!-- Wie die Form aussieht: Füllfarbe, Deckkraft in Prozent, Breite und Höhe.
       Verknüpfen hält beim Eintippen das Seitenverhältnis, die Anfasser ziehen
       weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
    <CbColorPicker
      v-model="color"
      :label="dictionary.cardEditor.fillColor"
      @change="(value) => changeElementColor(elementId, value)"
    />
    <CbElementOpacityField :element-id="elementId" />
    <CbSizeFields
      :width="data?.width"
      :height="data?.height"
      :width-label="dictionary.cardEditor.width"
      :height-label="dictionary.cardEditor.height"
      :link-label="dictionary.cardEditor.linkSizes"
      @change="
        (side, millimeters, keepsAspectRatio) =>
          changeElementSize(elementId, side, millimeters, keepsAspectRatio)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbColorPicker from '../../components/atoms/CbColorPicker.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbSizeFields from '../../components/molecules/CbSizeFields.vue'
import CbElementOpacityField from '../CbElementOpacityField.vue'
import {
  changeElementColor,
  changeElementSize,
  findCardSetElement,
  previewElementColor,
} from '../cardElements'
import { shapeAppearanceOf } from './shapeAppearance'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)

// Beim Ziehen nur zeigen, gespeichert wird bei change.
const color = computed({
  get: () => shapeAppearanceOf(data.value).color,
  set: (value) => previewElementColor(props.elementId, value),
})
</script>
