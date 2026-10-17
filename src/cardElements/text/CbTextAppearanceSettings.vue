<template>
  <!-- Wie der Text aussieht: Schrift, Abstände, Ausrichtung in der Textbox und
       Farbe. -->
  <div class="flex flex-col gap-3">
    <CbSettingsHeading>{{ dictionary.cardEditor.appearanceGroup }}</CbSettingsHeading>
    <CbSelect
      v-model="fontFamily"
      variant="field"
      hide-label
      :label="dictionary.cardEditor.fontFamily"
      :items="fontFamilyItemsIncluding(fontFamily)"
    />
    <CbSelect
      v-model="fontWeight"
      variant="field"
      hide-label
      :label="dictionary.cardEditor.fontWeight"
      :items="fontWeightItems"
    />
    <CbCombobox
      v-model="fontSize"
      hide-label
      :label="dictionary.cardEditor.fontSize"
      :items="fontSizeItems"
    />
    <div class="flex gap-3">
      <CbInput
        v-model="lineHeight"
        class="flex-1"
        icon="format_line_height"
        :label="dictionary.cardEditor.lineHeight"
      />
      <CbInput
        v-model="letterSpacing"
        class="flex-1"
        icon="format_letter_spacing_wider"
        :label="dictionary.cardEditor.letterSpacing"
      />
    </div>
    <div class="flex gap-3">
      <CbToggleGroup
        v-model="horizontalAlignmentIndex"
        class="flex-1"
        :label="dictionary.cardEditor.textAlignHorizontally"
        :items="horizontalAlignments"
      />
      <CbToggleGroup
        v-model="verticalAlignmentIndex"
        class="flex-1"
        :label="dictionary.cardEditor.textAlignVertically"
        :items="verticalAlignments"
      />
    </div>
    <CbColorPicker
      v-model="color"
      :label="dictionary.cardEditor.textColor"
      @change="(value) => changeTextColor(elementId, value)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbColorPicker from '../../components/atoms/CbColorPicker.vue'
import CbCombobox from '../../components/atoms/CbCombobox.vue'
import CbInput from '../../components/atoms/CbInput.vue'
import CbSelect from '../../components/atoms/CbSelect.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'
import { findCardSetElement } from '../cardElements'
import { fontFamilyItemsIncluding, fontSizeItems, fontWeightItems } from './fonts'
import {
  alignTextHorizontally,
  alignTextVertically,
  changeFontFamily,
  changeFontSize,
  changeTextColor,
  previewTextColor,
  textAppearanceOf,
} from './textAppearance'

const props = defineProps<{ elementId: string }>()

const element = computed(() => findCardSetElement(props.elementId))

const fontFamily = computed({
  get: () => textAppearanceOf(element.value?.data).fontFamily,
  set: (value) => changeFontFamily(props.elementId, value),
})

const fontSize = computed({
  get: () => textAppearanceOf(element.value?.data).fontSize,
  set: (millimeters) => changeFontSize(props.elementId, millimeters),
})

// Beim Ziehen nur zeigen, gespeichert wird bei change.
const color = computed({
  get: () => textAppearanceOf(element.value?.data).color,
  set: (value) => previewTextColor(props.elementId, value),
})

// Diese Werte leben vorerst nur hier und wirken noch nicht auf den Text.
const fontWeight = ref('regular')
const lineHeight = ref('20')
const letterSpacing = ref('0%')

const horizontalAlignments = computed(() => [
  {
    alignment: 'LEFT' as const,
    name: dictionary.cardEditor.textAlignLeft,
    icon: 'align_horizontal_left' as const,
  },
  {
    alignment: 'CENTER' as const,
    name: dictionary.cardEditor.textAlignCenter,
    icon: 'align_horizontal_center' as const,
  },
  {
    alignment: 'RIGHT' as const,
    name: dictionary.cardEditor.textAlignRight,
    icon: 'align_horizontal_right' as const,
  },
])

const horizontalAlignmentIndex = computed({
  get: () =>
    horizontalAlignments.value.findIndex(
      (item) => item.alignment === element.value?.data.alignment.horizontal,
    ),
  set: (index) =>
    alignTextHorizontally(props.elementId, horizontalAlignments.value[index].alignment),
})

const verticalAlignments = computed(() => [
  {
    alignment: 'TOP' as const,
    name: dictionary.cardEditor.textAlignTop,
    icon: 'align_vertical_top' as const,
  },
  {
    alignment: 'CENTER' as const,
    name: dictionary.cardEditor.textAlignMiddle,
    icon: 'align_vertical_center' as const,
  },
  {
    alignment: 'BOTTOM' as const,
    name: dictionary.cardEditor.textAlignBottom,
    icon: 'align_vertical_bottom' as const,
  },
])

const verticalAlignmentIndex = computed({
  get: () =>
    verticalAlignments.value.findIndex(
      (item) => item.alignment === element.value?.data.alignment.vertical,
    ),
  set: (index) => alignTextVertically(props.elementId, verticalAlignments.value[index].alignment),
})
</script>
