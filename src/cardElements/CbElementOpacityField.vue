<template>
  <!-- Die Deckkraft des Elements in Prozent, für jeden Elementtyp. -->
  <CbInput v-model="text" :label="dictionary.cardEditor.opacity" @change="applyText" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import { findCardSetElement } from './cardElements'
import { changeElementOpacity } from './changeElementOpacity'

const props = defineProps<{ elementId: string }>()

const opacity = computed(() => findCardSetElement(props.elementId)?.data.opacity ?? 1)
const storedText = computed(() =>
  dictionary.cardEditor.opacityValue(Math.round(opacity.value * 100)),
)
const text = ref(storedText.value)

watch(storedText, (stored) => (text.value = stored))

// Eingetippte Prozent: „50“, „50 %“ und „50,5%“ gehen. Leer oder ungültig → undefined.
function parsePercent(text: string) {
  const number = text.replace('%', '').replace(',', '.').trim()
  const value = Number(number)
  return number && Number.isFinite(value) ? value : undefined
}

// Gilt bei Enter bzw. beim Verlassen des Felds. Mehr als 100 bzw. weniger als 0
// wird begrenzt, Ungültiges zeigt wieder den gespeicherten Wert.
function applyText() {
  const percent = parsePercent(text.value)
  if (percent !== undefined) {
    changeElementOpacity(props.elementId, Math.min(Math.max(percent, 0), 100) / 100)
  }
  text.value = storedText.value
}
</script>
