<template>
  <!-- Die Deckkraft eines Elements in Prozent. -->
  <CbNumberInput
    :value="data && data.opacity * 100"
    :format="formatPercent"
    :parse="parsePercent"
    :label="dictionary.cardEditor.opacity"
    @commit="changeOpacity"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbNumberInput from '../components/molecules/CbNumberInput.vue'
import { changeElementOpacity, findCardSetElement } from './cardElements'

const props = defineProps<{ elementId: string }>()

const data = computed(() => findCardSetElement(props.elementId)?.data)

function formatPercent(percent: number | null | undefined) {
  return percent == null ? '' : dictionary.cardEditor.opacityValue(Math.round(percent))
}

// „50“, „50 %“ und „50,5%“ gehen. Leer oder ungültig → undefined.
function parsePercent(text: string) {
  const number = text.replace('%', '').replace(',', '.').trim()
  const value = Number(number)
  return number && Number.isFinite(value) ? value : undefined
}

// Mehr als 100 bzw. weniger als 0 wird begrenzt.
function changeOpacity(percent: number) {
  changeElementOpacity(props.elementId, Math.min(Math.max(percent, 0), 100) / 100)
}
</script>
