<template>
  <!-- Wo das Element auf der Karte liegt: die linke obere Ecke seiner Box in mm,
       gemessen von der linken oberen Kartenecke. Die Werte kommen direkt aus den
       Daten und laufen deshalb beim Ziehen auf der Karte mit. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.positionGroup }}</CbSettingsHeading>
    <div class="flex items-center gap-3">
      <CbInput
        class="flex-1"
        :model-value="formatMillimeters(position?.x)"
        :label="dictionary.cardEditor.positionX"
      />
      <CbInput
        class="flex-1"
        :model-value="formatMillimeters(position?.y)"
        :label="dictionary.cardEditor.positionY"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import { currentLanguage } from '../dictionary/dictionary'
import { findCardSetElement } from './cardElements'

const props = defineProps<{ elementId: string }>()

const position = computed(() => findCardSetElement(props.elementId)?.data.position)

// Eine Nachkommastelle, mit dem Dezimalzeichen der gewählten Sprache.
function formatMillimeters(value: number | undefined) {
  return value?.toLocaleString(currentLanguage.value, { maximumFractionDigits: 1 }) ?? ''
}
</script>
