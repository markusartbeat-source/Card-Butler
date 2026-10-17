<template>
  <!-- Wie die Textbox zu ihrer Größe kommt, wie in Figma: automatische Breite,
       automatische Höhe oder feste Größe. Darunter ihre Größe in mm. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.textboxGroup }}</CbSettingsHeading>
    <!-- Gleich breit wie eine Ausrichten-Gruppe unter „Position“. -->
    <div class="grid grid-cols-2 gap-3">
      <CbToggleGroup
        v-model="sizingIndex"
        :label="dictionary.cardEditor.textboxSizing"
        :items="sizings"
      />
    </div>
    <!-- Eine automatische Seite zeigt „-“. Verknüpfen wirkt noch nicht. -->
    <div class="flex items-center gap-3">
      <CbInput
        v-model="texts.width"
        class="flex-1"
        :label="dictionary.cardEditor.width"
        :placeholder="dictionary.cardEditor.automaticSizeMark"
        :spoken-placeholder="dictionary.cardEditor.automaticSize"
        @change="applyText('width')"
      />
      <CbToggle
        v-model="areSizesLinked"
        icon="link"
        :aria-label="dictionary.cardEditor.linkSizes"
      />
      <CbInput
        v-model="texts.height"
        class="flex-1"
        :label="dictionary.cardEditor.height"
        :placeholder="dictionary.cardEditor.automaticSizeMark"
        :spoken-placeholder="dictionary.cardEditor.automaticSize"
        @change="applyText('height')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CbInput from '../../components/atoms/CbInput.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbToggle from '../../components/atoms/CbToggle.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'
import { findCardSetElement } from '../cardElements'
import { formatMillimeters, parseMillimeters } from '../../card/millimeters'
import { changeTextSize, changeTextSizing, textSizingOf } from './textSizing'

const props = defineProps<{ elementId: string }>()

const sizings = computed(() => [
  {
    sizing: 'autoWidth' as const,
    name: dictionary.cardEditor.autoWidth,
    icon: 'start' as const,
  },
  {
    sizing: 'autoHeight' as const,
    name: dictionary.cardEditor.autoHeight,
    icon: 'wrap_text' as const,
  },
  {
    sizing: 'fixed' as const,
    name: dictionary.cardEditor.fixedSize,
    icon: 'article' as const,
  },
])

const element = computed(() => findCardSetElement(props.elementId))
const sizing = computed(() => textSizingOf(element.value))

const sizingIndex = computed({
  get: () => sizings.value.findIndex((item) => item.sizing === sizing.value),
  set: (index) => changeTextSizing(props.elementId, sizings.value[index].sizing),
})

const data = computed(() => element.value?.data)
const areSizesLinked = ref(false)

// Automatisch: Feld leer, es zeigt dann „-“.
const storedTexts = computed(() => ({
  width: sizing.value === 'autoWidth' ? '' : formatMillimeters(data.value?.width),
  height: sizing.value === 'fixed' ? formatMillimeters(data.value?.height) : '',
}))
const texts = ref({ ...storedTexts.value })

// Ziehen an den Anfassern ändert die Größe erst am Ende – dann stehen hier die
// neuen Werte.
watch(storedTexts, (stored) => (texts.value = { ...stored }))

// Wie bei der Position: Gilt bei Enter bzw. beim Verlassen des Felds,
// unveränderter Text zählt nicht. Ungültiges oder ≤ 0 zeigt wieder den
// gespeicherten Wert bzw. „-“.
function applyText(side: 'width' | 'height') {
  const text = texts.value[side].trim()
  const value = parseMillimeters(text)
  if (text !== storedTexts.value[side] && value !== undefined && value > 0) {
    changeTextSize(props.elementId, side, value)
  }
  texts.value = { ...storedTexts.value }
}
</script>
