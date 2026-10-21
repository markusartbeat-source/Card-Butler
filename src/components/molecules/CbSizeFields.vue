<template>
  <!-- Breite und Höhe nebeneinander, dazwischen der Knopf zum Verknüpfen. -->
  <div class="flex items-center gap-3">
    <CbNumberInput
      :value="width"
      class="flex-1"
      :label="widthLabel"
      :placeholder="placeholder"
      :spoken-placeholder="spokenPlaceholder"
      @commit="(millimeters) => emitChange('width', millimeters)"
    />
    <CbToggle
      v-model="areSidesLinked"
      icon="link"
      :disabled="linkDisabled"
      :aria-label="linkLabel"
    />
    <CbNumberInput
      :value="height"
      class="flex-1"
      :label="heightLabel"
      :placeholder="placeholder"
      :spoken-placeholder="spokenPlaceholder"
      @commit="(millimeters) => emitChange('height', millimeters)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbToggle from '../atoms/CbToggle.vue'
import CbNumberInput from './CbNumberInput.vue'

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

// change: eine neue Seite über 0 mm. keepsAspectRatio sagt, dass die andere
// Seite im gleichen Verhältnis mitgehen soll – umrechnen muss der Aufrufer.
const emit = defineEmits<{
  change: [side: Side, millimeters: number, keepsAspectRatio: boolean]
}>()

const areSidesLinked = ref(false)

function emitChange(side: Side, millimeters: number) {
  if (millimeters > 0) emit('change', side, millimeters, areSidesLinked.value && !props.linkDisabled)
}
</script>
