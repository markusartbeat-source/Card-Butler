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
      <CbNumberInput
        :value="position?.x"
        class="flex-1"
        :label="dictionary.cardEditor.positionX"
        @commit="(x) => position && changeElementPosition(elementId, x, position.y)"
      />
      <CbNumberInput
        :value="position?.y"
        class="flex-1"
        :label="dictionary.cardEditor.positionY"
        @commit="(y) => position && changeElementPosition(elementId, position.x, y)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbSettingsHeading from '../components/atoms/CbSettingsHeading.vue'
import CbButtonGroup from '../components/molecules/CbButtonGroup.vue'
import CbNumberInput from '../components/molecules/CbNumberInput.vue'
import {
  alignElementHorizontally,
  alignElementVertically,
  changeElementPosition,
  findCardSetElement,
} from './cardElements'

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
</script>
