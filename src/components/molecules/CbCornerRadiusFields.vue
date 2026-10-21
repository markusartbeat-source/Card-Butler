<template>
  <!-- Ein Feld für alle Ecken oder ein Feld je Ecke, rechts der Knopf zum Wechseln. -->
  <div class="flex items-center gap-3">
    <CbSlideSwap class="grow" :show-second="areCornersSeparate">
      <template #first>
        <CbInput
          v-model="allCornersText"
          icon="crop_free"
          :label="dictionary.cardEditor.cornerRadius"
          @change="applyAllCornersText"
        />
      </template>
      <!-- Zwei Reihen mit je zwei Feldern, jedes gleich breit. -->
      <template #second>
        <div class="flex flex-col gap-3">
          <div v-for="(row, index) in cornerRows" :key="index" class="flex gap-3">
            <CbNumberInput
              v-for="corner in row"
              :key="corner.key"
              :value="radii[corner.key]"
              class="flex-1"
              :icon="corner.icon"
              :label="corner.label"
              @commit="(value) => changeCorner(corner.key, value)"
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
import CbNumberInput from './CbNumberInput.vue'

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

// Unter 0 zeigt das Feld wieder den gespeicherten Wert.
function changeCorner(corner: Corner, value: number) {
  if (value >= 0) emit('change', { ...props.radii, [corner]: value })
}

// Das eine Feld zeigt bei gleichen Ecken einen Wert, sonst alle vier mit Komma
// und Leerzeichen dazwischen.
const storedAllCornersText = computed(() =>
  areCornerRadiiUniform(props.radii)
    ? formatMillimeters(props.radii.topLeft)
    : corners.map((corner) => formatMillimeters(props.radii[corner])).join(', '),
)
const allCornersText = ref(storedAllCornersText.value)

watch(storedAllCornersText, (stored) => (allCornersText.value = stored))

// Unveränderter Text zählt nicht, Ungültiges oder unter 0 zeigt wieder den
// gespeicherten Wert. Im Feld stehen bis zu vier Werte mit Komma und
// Leerzeichen dazwischen (ein Komma allein ist das Dezimalzeichen). Fehlende
// nehmen den ersten Wert, „20“ gilt also für alle Ecken.
function applyAllCornersText() {
  const text = allCornersText.value.trim()
  const values = text.split(/,\s+/).map(parseMillimeters)
  const isValid = values.every((value) => value !== undefined && value >= 0)
  if (text !== storedAllCornersText.value && isValid) {
    const radii = Object.fromEntries(
      corners.map((corner, index) => [corner, values[index] ?? values[0]]),
    )
    emit('change', radii as CornerRadii)
  }
  allCornersText.value = storedAllCornersText.value
}
</script>
