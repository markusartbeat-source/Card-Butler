<template>
  <!-- Wie das Bild auf der Karte erscheint – welches Bild und welcher Ausschnitt,
       beides gilt nur für diese Karte. Der Knopf startet das Zuschneiden auf der
       Karte, ohne Bild gibt es nichts zuzuschneiden. Die Deckkraft in Prozent.
       Verknüpfen hält beim Eintippen das Seitenverhältnis, die Anfasser ziehen
       weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
    <CbPictureSelect :element-id="elementId" :card="card" />
    <CbButton
      variant="light"
      class="justify-center"
      :disabled="!card.values[elementId]?.imageId"
      @click="startEditingElement(elementId)"
    >
      <CbIcon name="crop" />
      {{ dictionary.cardEditor.adjustCrop }}
    </CbButton>
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
import CbButton from '../../components/atoms/CbButton.vue'
import CbIcon from '../../components/atoms/CbIcon.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbSizeFields from '../../components/molecules/CbSizeFields.vue'
import type { Card } from '../../cardSets/cardSets'
import { startEditingElement } from '../../elementTransform/elementSelection'
import CbElementOpacityField from '../CbElementOpacityField.vue'
import { changeElementSize, findCardSetElement } from '../cardElements'
import CbPictureSelect from './CbPictureSelect.vue'

// card ist die Karte, die gerade im Editor offen ist.
const props = defineProps<{ elementId: string; card: Card }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)
</script>
