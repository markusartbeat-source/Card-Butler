<template>
  <!-- Reihe aus Icon-Knöpfen auf einer gemeinsamen Fläche, dünne Linien
       dazwischen. Bekommt die Gruppe eine Breite, teilen die Knöpfe sie gleich
       auf. Der Name steht als Tooltip am Knopf und ist für Screenreader sein
       Name. -->
  <div role="group" :aria-label="label" class="flex rounded-md bg-surface-light">
    <CbTooltip v-for="(item, index) in items" :key="item.name" :text="item.name">
      <CbButtonGroupItem :icon="item.icon" :aria-label="item.name" @click="emit('select', index)" />
    </CbTooltip>
  </div>
</template>

<script setup lang="ts">
import CbButtonGroupItem from '../atoms/CbButtonGroupItem.vue'
import CbTooltip from '../atoms/CbTooltip.vue'
import type { IconName } from '../atoms/icons'

defineProps<{ label: string; items: { name: string; icon: IconName }[] }>()

// Meldet nur, welcher Knopf geklickt wurde – was er bewirkt, entscheidet der
// Aufrufer.
const emit = defineEmits<{ select: [index: number] }>()
</script>
