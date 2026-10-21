<template>
  <!-- Wie die Form aussieht: Deckkraft in Prozent, Breite und Höhe. Verknüpfen
       hält beim Eintippen das Seitenverhältnis, die Anfasser ziehen weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
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
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbSizeFields from '../../components/molecules/CbSizeFields.vue'
import CbElementOpacityField from '../CbElementOpacityField.vue'
import { changeElementSize, findCardSetElement } from '../cardElements'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)
</script>
