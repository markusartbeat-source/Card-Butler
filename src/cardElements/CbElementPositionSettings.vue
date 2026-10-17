<template>
  <!-- Wo das Element auf der Karte liegt: die linke obere Ecke seiner Box in mm,
       gemessen von der linken oberen Kartenecke. Beim Ziehen auf der Karte
       laufen die Werte mit. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.positionGroup }}</CbSettingsHeading>
    <div class="flex items-center gap-3">
      <CbInput
        v-model="texts.x"
        class="flex-1"
        :label="dictionary.cardEditor.positionX"
        @change="applyText('x')"
      />
      <CbInput
        v-model="texts.y"
        class="flex-1"
        :label="dictionary.cardEditor.positionY"
        @change="applyText('y')"
      />
    </div>
    <!-- TEMPORÄR (Plan „Position“, Schritt 6 entfernt es): Version des Elements,
         steigt nach jedem erfolgreichen Speichern. -->
    <p class="text-xs text-label">Version {{ element?.version }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import { currentLanguage } from '../dictionary/dictionary'
import { findCardSetElement, moveElementTo } from './cardElements'
import { saveElement } from './saveElement'

const props = defineProps<{ elementId: string }>()

const element = computed(() => findCardSetElement(props.elementId))
const position = computed(() => element.value?.data.position)

const texts = ref({ x: '', y: '' })

// Eine Nachkommastelle, mit dem Dezimalzeichen der gewählten Sprache.
function formatMillimeters(value: number | undefined) {
  return value?.toLocaleString(currentLanguage.value, { maximumFractionDigits: 1 }) ?? ''
}

function showStoredPosition() {
  texts.value = { x: formatMillimeters(position.value?.x), y: formatMillimeters(position.value?.y) }
}

watch(position, showStoredPosition, { immediate: true })

// Gespeichert wird bei Enter bzw. beim Verlassen des Felds. Unveränderter Text
// zählt nicht – sonst verschöbe schon das Runden der Anzeige das Element.
// Komma und Punkt gehen beide, Ungültiges zeigt wieder den gespeicherten Wert.
function applyText(axis: 'x' | 'y') {
  const text = texts.value[axis].trim()
  if (!position.value || text === formatMillimeters(position.value[axis])) return

  const value = Number(text.replace(',', '.'))
  if (!text || !Number.isFinite(value)) return showStoredPosition()

  const { x, y } = { ...position.value, [axis]: value }
  moveElementTo(props.elementId, x, y)
  saveElement(props.elementId)
}
</script>
