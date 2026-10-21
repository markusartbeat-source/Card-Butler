<template>
  <!-- Breite und Höhe nebeneinander, dazwischen der Knopf zum Verknüpfen. -->
  <div class="flex items-center gap-3">
    <CbInput
      v-model="texts.width"
      class="flex-1"
      :label="widthLabel"
      :placeholder="placeholder"
      :spoken-placeholder="spokenPlaceholder"
      @change="applyText('width')"
    />
    <CbToggle
      v-model="areSidesLinked"
      icon="link"
      :disabled="linkDisabled"
      :aria-label="linkLabel"
    />
    <CbInput
      v-model="texts.height"
      class="flex-1"
      :label="heightLabel"
      :placeholder="placeholder"
      :spoken-placeholder="spokenPlaceholder"
      @change="applyText('height')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../atoms/CbInput.vue'
import CbToggle from '../atoms/CbToggle.vue'
import { formatMillimeters, parseMillimeters } from '../../card/millimeters'

type Side = 'width' | 'height'

// Breite und Höhe in mm. Eine Seite ohne Wert zeigt den Platzhalter.
// linkDisabled sperrt das Verknüpfen, z.B. wenn es kein Verhältnis zu halten gibt.
const props = defineProps<{
  width?: number | null
  height?: number | null
  widthLabel: string
  heightLabel: string
  linkLabel: string
  linkDisabled?: boolean
  placeholder?: string
  spokenPlaceholder?: string
}>()

// change: eine neue Seite über 0 mm, bestätigt mit Enter oder beim Verlassen des
// Felds. keepsAspectRatio sagt, dass die andere Seite im gleichen Verhältnis
// mitgehen soll – umrechnen muss der Aufrufer.
const emit = defineEmits<{
  change: [side: Side, millimeters: number, keepsAspectRatio: boolean]
}>()

const areSidesLinked = ref(false)

const storedTexts = computed(() => ({
  width: formatMillimeters(props.width),
  height: formatMillimeters(props.height),
}))
const texts = ref({ ...storedTexts.value })

// Ändert sich die Größe von außen (z.B. am Ende des Ziehens an den Anfassern),
// stehen hier die neuen Werte.
watch(storedTexts, (stored) => (texts.value = { ...stored }))

// Unveränderter Text zählt nicht. Ungültiges oder ≤ 0 zeigt wieder den
// gespeicherten Wert bzw. den Platzhalter.
function applyText(side: Side) {
  const text = texts.value[side].trim()
  const value = parseMillimeters(text)
  if (text !== storedTexts.value[side] && value !== undefined && value > 0) {
    emit('change', side, value, areSidesLinked.value && !props.linkDisabled)
  }
  texts.value = { ...storedTexts.value }
}
</script>
