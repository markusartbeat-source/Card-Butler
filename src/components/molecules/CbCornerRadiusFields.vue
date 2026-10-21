<template>
  <!-- Ein Feld für alle Ecken oder ein Feld je Ecke, rechts der Knopf zum Wechseln. -->
  <div class="flex items-center gap-3">
    <CbSlideSwap class="grow" :show-second="areCornersSeparate">
      <template #first>
        <CbInput
          v-model="texts.allCorners"
          icon="crop_free"
          :label="dictionary.cardEditor.cornerRadius"
          @change="applyText('allCorners')"
        />
      </template>
      <!-- Zwei Reihen mit je zwei Feldern, jedes gleich breit. -->
      <template #second>
        <div class="flex flex-col gap-3">
          <div v-for="(row, index) in cornerRows" :key="index" class="flex gap-3">
            <CbInput
              v-for="corner in row"
              :key="corner.key"
              v-model="texts[corner.key]"
              class="flex-1"
              :icon="corner.icon"
              :label="corner.label"
              @change="applyText(corner.key)"
            />
          </div>
        </div>
      </template>
    </CbSlideSwap>
    <CbToggle
      v-model="areCornersSeparate"
      icon="crop_free"
      :aria-label="dictionary.cardEditor.separateCorners"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../atoms/CbInput.vue'
import CbSlideSwap from '../atoms/CbSlideSwap.vue'
import CbToggle from '../atoms/CbToggle.vue'
import {
  areCornerRadiiUniform,
  corners,
  type Corner,
  type CornerRadii,
} from '../../card/cornerRadii'
import { formatMillimeters, parseMillimeters } from '../../card/millimeters'

// Die Rundung jeder Ecke in mm.
const props = defineProps<{ radii: CornerRadii }>()

// change: neue Rundungen ab 0 mm, bestätigt mit Enter oder beim Verlassen eines
// Felds. Speichern muss der Aufrufer.
const emit = defineEmits<{ change: [radii: CornerRadii] }>()

// Verschiedene Ecken stehen gleich einzeln da.
const areCornersSeparate = ref(!areCornerRadiiUniform(props.radii))

const cornerRows = computed(() => [
  [
    {
      key: 'topLeft' as const,
      icon: 'north_west' as const,
      label: dictionary.cardEditor.cornerTopLeft,
    },
    {
      key: 'topRight' as const,
      icon: 'north_east' as const,
      label: dictionary.cardEditor.cornerTopRight,
    },
  ],
  [
    {
      key: 'bottomLeft' as const,
      icon: 'south_west' as const,
      label: dictionary.cardEditor.cornerBottomLeft,
    },
    {
      key: 'bottomRight' as const,
      icon: 'south_east' as const,
      label: dictionary.cardEditor.cornerBottomRight,
    },
  ],
])

// Ein Text je Feld. Das eine Feld zeigt bei gleichen Ecken einen Wert, sonst alle
// vier mit Komma und Leerzeichen dazwischen.
const storedTexts = computed(() => {
  const cornerTexts = Object.fromEntries(
    corners.map((corner) => [corner, formatMillimeters(props.radii[corner])]),
  ) as Record<Corner, string>
  const allCorners = areCornerRadiiUniform(props.radii)
    ? cornerTexts.topLeft
    : corners.map((corner) => cornerTexts[corner]).join(', ')
  return { ...cornerTexts, allCorners }
})
const texts = ref({ ...storedTexts.value })

watch(storedTexts, (stored) => (texts.value = { ...stored }))

// Unveränderter Text zählt nicht, Ungültiges oder unter 0 zeigt wieder den
// gespeicherten Wert. Im einen Feld stehen bis zu vier Werte mit Komma und
// Leerzeichen dazwischen (ein Komma allein ist das Dezimalzeichen). Fehlende
// nehmen den ersten Wert, „20“ gilt also für alle Ecken.
function applyText(field: Corner | 'allCorners') {
  const text = texts.value[field].trim()
  const values = (field === 'allCorners' ? text.split(/,\s+/) : [text]).map(parseMillimeters)
  const isValid = values.every((value) => value !== undefined && value >= 0)
  if (text !== storedTexts.value[field] && isValid) {
    const radii =
      field === 'allCorners'
        ? Object.fromEntries(corners.map((corner, index) => [corner, values[index] ?? values[0]]))
        : { ...props.radii, [field]: values[0] }
    emit('change', radii as CornerRadii)
  }
  texts.value = { ...storedTexts.value }
}
</script>
