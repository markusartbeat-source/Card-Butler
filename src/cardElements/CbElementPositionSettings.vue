<template>
  <!-- Wo das Element auf der Karte liegt: die linke obere Ecke seiner Box in mm,
       gemessen von der linken oberen Kartenecke. Beim Ziehen auf der Karte
       laufen die Werte mit. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.positionGroup }}</CbSettingsHeading>
    <!-- Gleich breit wie die Felder darunter, so stehen die Gruppen über X und Y. -->
    <div class="flex gap-3">
      <CbButtonGroup
        class="flex-1"
        :label="dictionary.cardEditor.alignHorizontally"
        :items="horizontalAlignments"
        @select="alignHorizontally"
      />
      <CbButtonGroup
        class="flex-1"
        :label="dictionary.cardEditor.alignVertically"
        :items="verticalAlignments"
        @select="alignVertically"
      />
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbButtonGroup from '../components/molecules/CbButtonGroup.vue'
import { currentLanguage } from '../dictionary/dictionary'
import { alignElementHorizontally, alignElementVertically } from './alignElement'
import { findCardSetElement, moveElementTo } from './cardElements'
import { saveElement } from './saveElement'

const props = defineProps<{ elementId: string }>()

const position = computed(() => findCardSetElement(props.elementId)?.data.position)

const horizontalAlignments = computed(() => [
  {
    alignment: 'left' as const,
    name: dictionary.cardEditor.alignLeft,
    icon: 'align_horizontal_left' as const,
  },
  {
    alignment: 'center' as const,
    name: dictionary.cardEditor.alignHorizontalCenter,
    icon: 'align_horizontal_center' as const,
  },
  {
    alignment: 'right' as const,
    name: dictionary.cardEditor.alignRight,
    icon: 'align_horizontal_right' as const,
  },
])

function alignHorizontally(index: number) {
  alignElementHorizontally(props.elementId, horizontalAlignments.value[index].alignment)
}

const verticalAlignments = computed(() => [
  {
    alignment: 'top' as const,
    name: dictionary.cardEditor.alignTop,
    icon: 'align_vertical_top' as const,
  },
  {
    alignment: 'center' as const,
    name: dictionary.cardEditor.alignVerticalCenter,
    icon: 'align_vertical_center' as const,
  },
  {
    alignment: 'bottom' as const,
    name: dictionary.cardEditor.alignBottom,
    icon: 'align_vertical_bottom' as const,
  },
])

function alignVertically(index: number) {
  alignElementVertically(props.elementId, verticalAlignments.value[index].alignment)
}

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
