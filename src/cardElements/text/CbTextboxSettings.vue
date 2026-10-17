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
    <!-- Vorerst nur zum Ansehen: Eintippen und Verknüpfen wirken noch nicht. -->
    <div class="flex items-center gap-3">
      <CbInput v-model="texts.width" class="flex-1" :label="dictionary.cardEditor.width" />
      <CbToggle
        v-model="areSizesLinked"
        icon="link"
        :aria-label="dictionary.cardEditor.linkSizes"
      />
      <CbInput v-model="texts.height" class="flex-1" :label="dictionary.cardEditor.height" />
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

const props = defineProps<{ elementId: string }>()

const sizings = computed(() => [
  { name: dictionary.cardEditor.autoWidth, icon: 'start' as const },
  { name: dictionary.cardEditor.autoHeight, icon: 'wrap_text' as const },
  { name: dictionary.cardEditor.fixedSize, icon: 'article' as const },
])

// Vorerst nur hier im Panel, noch ohne Wirkung aufs Textfeld. Feste Größe, weil
// sich Textfelder heute so verhalten.
const sizingIndex = ref(2)

const data = computed(() => findCardSetElement(props.elementId)?.data)
const texts = ref({ width: '', height: '' })
const areSizesLinked = ref(false)

// Ziehen an den Anfassern ändert die Größe erst am Ende – dann stehen hier die
// neuen Werte.
watch(
  () => [data.value?.width, data.value?.height],
  () => {
    texts.value = {
      width: formatMillimeters(data.value?.width),
      height: formatMillimeters(data.value?.height),
    }
  },
  { immediate: true },
)
</script>
