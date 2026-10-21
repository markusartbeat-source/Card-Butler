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
    <!-- Eine automatische Seite zeigt „-“, ohne Verhältnis zum Halten.
         Verknüpfen hält beim Eintippen das Seitenverhältnis, die Anfasser ziehen
         weiter frei. -->
    <CbSizeFields
      :width="sizing === 'autoWidth' ? null : data?.width"
      :height="sizing === 'fixed' ? data?.height : null"
      :width-label="dictionary.cardEditor.width"
      :height-label="dictionary.cardEditor.height"
      :link-label="dictionary.cardEditor.linkSizes"
      :link-disabled="sizing !== 'fixed'"
      :placeholder="dictionary.cardEditor.automaticSizeMark"
      :spoken-placeholder="dictionary.cardEditor.automaticSize"
      @change="
        (side, millimeters, keepsAspectRatio) =>
          changeTextSize(elementId, side, millimeters, keepsAspectRatio)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbSizeFields from '../../components/molecules/CbSizeFields.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'
import { findCardSetElement } from '../cardElements'
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
</script>
