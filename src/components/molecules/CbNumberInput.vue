<template>
  <!-- Ein Zahlenfeld: zeigt den gespeicherten Wert, ein eingetippter gilt erst bei
       Enter bzw. beim Verlassen des Felds. Die übrigen Attribute (icon,
       placeholder …) gehen an CbInput. -->
  <CbInput v-model="text" :label="label" @change="commitText" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../atoms/CbInput.vue'
import { formatMillimeters, parseMillimeters } from '../../card/millimeters'

// value ohne Zahl zeigt den Platzhalter. format und parse wandeln zwischen Zahl
// und Text, ohne Angabe in mm. parse liefert für Ungültiges undefined.
const props = withDefaults(
  defineProps<{
    label: string
    value?: number | null
    format?: (value: number | null | undefined) => string
    parse?: (text: string) => number | undefined
  }>(),
  { format: formatMillimeters, parse: parseMillimeters },
)

// commit: eine gültige, geänderte Zahl. Prüfen und speichern muss der Aufrufer.
const emit = defineEmits<{ commit: [value: number] }>()

const storedText = computed(() => props.format(props.value))
const text = ref(storedText.value)

// Ändert sich der Wert von außen (z.B. beim Ziehen an den Anfassern), steht hier
// der neue.
watch(storedText, (stored) => (text.value = stored))

// Unveränderter Text zählt nicht – sonst änderte schon das Runden der Anzeige
// den Wert. Danach steht wieder der gespeicherte Wert da: der neue, wenn der
// Aufrufer ihn übernommen hat, sonst der alte.
function commitText() {
  const value = props.parse(text.value.trim())
  if (text.value.trim() !== storedText.value && value !== undefined) emit('commit', value)
  text.value = storedText.value
}
</script>
