<template>
  <!-- Wie das Bild auf der Karte erscheint – welches Bild und welcher Ausschnitt,
       beides gilt nur für diese Karte. Der Knopf startet das Zuschneiden auf der
       Karte, ohne Bild gibt es nichts zuzuschneiden. Verknüpfen hält beim
       Eintippen das Seitenverhältnis, die Anfasser ziehen weiter frei. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
    <CbPictureSelect :element-id="elementId" :card="card" />
    <CbButton
      variant="light"
      class="justify-center"
      :disabled="!imageId"
      @click="startEditingElement(elementId)"
    >
      <CbIcon name="crop" />
      {{ dictionary.cardEditor.adjustCrop }}
    </CbButton>
    <!-- TEMPORÄR (Bild-Plan Schritt 8): gespeicherter Ausschnitt dieser Karte,
         entfällt im Aufräumschritt. -->
    <pre v-if="crop" class="text-xs text-label">{{ crop }}</pre>
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
import { findCardSetElement } from '../cardElements'
import { changeElementSize } from '../changeElementSize'
import CbPictureSelect from './CbPictureSelect.vue'
import { pictureCropOf } from './pictureCrops'

// card ist die Karte, die gerade im Editor offen ist.
const props = defineProps<{ elementId: string; card: Card }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)

const imageId = computed(() => props.card.elementImageIds[props.elementId])

// TEMPORÄR (Bild-Plan Schritt 8): nur für die Anzeige oben.
const crop = computed(() =>
  imageId.value ? pictureCropOf(props.card.id, props.elementId, imageId.value) : undefined,
)
</script>
