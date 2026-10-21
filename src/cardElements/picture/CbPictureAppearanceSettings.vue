<template>
  <!-- Wie das Bild auf der Karte erscheint – welches Bild, gilt nur für diese
       Karte. Verknüpfen hält beim Eintippen das Seitenverhältnis, die Anfasser
       ziehen weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
    <CbPictureSelect :element-id="elementId" :card="card" />
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
import type { Card } from '../../cardSets/cardSets'
import CbElementOpacityField from '../CbElementOpacityField.vue'
import { findCardSetElement } from '../cardElements'
import { changeElementSize } from '../changeElementSize'
import CbPictureSelect from './CbPictureSelect.vue'

// card ist die Karte, die gerade im Editor offen ist.
const props = defineProps<{ elementId: string; card: Card }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)
</script>
