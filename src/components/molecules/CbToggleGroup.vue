<template>
  <!-- Reihe aus Icon-Knöpfen wie CbButtonGroup, aber zum Auswählen: Es ist
       immer genau einer gewählt, er ist heller hinterlegt. Ark UI bringt nur das
       Verhalten (Pfeiltasten, Screenreader-Rolle „Optionsfeld“). -->
  <ToggleGroup.Root
    :aria-label="label"
    :deselectable="false"
    :model-value="[String(modelValue)]"
    class="flex rounded-md bg-surface-light"
    @update:model-value="(values) => $emit('update:modelValue', Number(values[0]))"
  >
    <!-- Die Auswahl liegt außen um den Tooltip, damit ihre Kennungen am Knopf
         gewinnen – sonst finden die Pfeiltasten die Knöpfe nicht. -->
    <ToggleGroup.Item
      v-for="(item, index) in items"
      :key="item.name"
      :value="String(index)"
      as-child
    >
      <CbTooltip :text="item.name">
        <CbButtonGroupItem
          class="aria-checked:rounded-sm aria-checked:bg-surface-selected"
          :icon="item.icon"
          :aria-label="item.name"
        />
      </CbTooltip>
    </ToggleGroup.Item>
  </ToggleGroup.Root>
</template>

<script setup lang="ts">
import { ToggleGroup } from '@ark-ui/vue'
import CbButtonGroupItem from '../atoms/CbButtonGroupItem.vue'
import CbTooltip from '../atoms/CbTooltip.vue'
import type { IconName } from '../atoms/icons'

// Gewählt wird per Index – was er bedeutet, entscheidet der Aufrufer.
defineProps<{ label: string; items: { name: string; icon: IconName }[]; modelValue: number }>()
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>
