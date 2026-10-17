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
    <!-- Vorerst nur zum Ansehen: Eintippen und Verknüpfen wirken noch nicht.
         Eine automatische Seite zeigt „-“. -->
    <div class="flex items-center gap-3">
      <CbInput
        v-model="texts.width"
        class="flex-1"
        :label="dictionary.cardEditor.width"
        :placeholder="dictionary.cardEditor.automaticSizeMark"
        :spoken-placeholder="dictionary.cardEditor.automaticSize"
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
import { formatMillimeters } from '../formatMillimeters'
import { setTextSizing, textSizingOf } from './textSizing'

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

const sizing = computed(() => textSizingOf(props.elementId))

const sizingIndex = computed({
  get: () => sizings.value.findIndex((item) => item.sizing === sizing.value),
  set: (index) => setTextSizing(props.elementId, sizings.value[index].sizing),
})

const data = computed(() => findCardSetElement(props.elementId)?.data)
const texts = ref({ width: '', height: '' })
const areSizesLinked = ref(false)

// Ziehen an den Anfassern ändert die Größe erst am Ende – dann stehen hier die
// neuen Werte. Automatisch: Feld leer, es zeigt dann „-“.
watch(
  () => [data.value?.width, data.value?.height, sizing.value],
  () => {
    texts.value = {
      width: sizing.value === 'autoWidth' ? '' : formatMillimeters(data.value?.width),
      height: sizing.value === 'fixed' ? formatMillimeters(data.value?.height) : '',
    }
  },
  { immediate: true },
)
</script>
