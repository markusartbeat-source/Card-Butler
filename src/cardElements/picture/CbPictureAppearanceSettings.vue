<template>
  <!-- Wie das Bild auf der Karte erscheint. Verknüpfen hält beim Eintippen das
       Seitenverhältnis, die Anfasser ziehen weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
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
import { findCardSetElement } from '../cardElements'
import { changeElementSize } from '../changeElementSize'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)
</script>
