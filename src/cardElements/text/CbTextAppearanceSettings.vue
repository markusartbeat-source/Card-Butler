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
      :items="fontFamilyItems"
    />
    <CbSelect
      v-model="fontWeight"
      variant="field"
      hide-label
      :label="dictionary.cardEditor.fontWeight"
      :items="fontWeightItems"
    />
    <CbSelect
      v-model="fontSize"
      variant="field"
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
    <CbColorPicker v-model="color" :label="dictionary.cardEditor.textColor" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbColorPicker from '../../components/atoms/CbColorPicker.vue'
import CbInput from '../../components/atoms/CbInput.vue'
import CbSelect from '../../components/atoms/CbSelect.vue'
import CbSettingsHeading from '../../components/atoms/CbSettingsHeading.vue'
import CbToggleGroup from '../../components/molecules/CbToggleGroup.vue'
import { fontFamilyItems, fontSizeItems, fontWeightItems } from './fonts'

// Die Werte leben vorerst nur hier und wirken noch nicht auf den Text.
const fontFamily = ref('Arial')
const fontWeight = ref('regular')
const fontSize = ref('14')
const lineHeight = ref('20')
const letterSpacing = ref('0%')
const horizontalAlignmentIndex = ref(0)
const verticalAlignmentIndex = ref(0)
const color = ref('#ffffff')

const horizontalAlignments = computed(() => [
  { name: dictionary.cardEditor.textAlignLeft, icon: 'align_horizontal_left' as const },
  { name: dictionary.cardEditor.textAlignCenter, icon: 'align_horizontal_center' as const },
  { name: dictionary.cardEditor.textAlignRight, icon: 'align_horizontal_right' as const },
])

const verticalAlignments = computed(() => [
  { name: dictionary.cardEditor.textAlignTop, icon: 'align_vertical_top' as const },
  { name: dictionary.cardEditor.textAlignMiddle, icon: 'align_vertical_center' as const },
  { name: dictionary.cardEditor.textAlignBottom, icon: 'align_vertical_bottom' as const },
])
</script>
