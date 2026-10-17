<template>
  <!-- Reihe aus Icon-Knöpfen auf einer gemeinsamen Fläche, dünne Linien
       dazwischen. Bekommt die Gruppe eine Breite, teilen die Knöpfe sie gleich
       auf. Der Name steht als Tooltip am Knopf und ist für Screenreader sein
       Name. Die Tooltips legen eigene Elemente neben die Knöpfe – deshalb zählen
       Linien und runde Enden nur die Knöpfe selbst (*-of-type). -->
  <div role="group" :aria-label="label" class="flex rounded-md bg-surface-light">
    <CbTooltip v-for="(item, index) in items" :key="item.name" :text="item.name">
      <CbInteractive
        class="flex flex-1 justify-center border-l border-surface py-1 text-white first-of-type:rounded-l-md first-of-type:border-l-0 last-of-type:rounded-r-md"
        :aria-label="item.name"
        @click="emit('select', index)"
      >
        <CbIcon :name="item.icon" />
      </CbInteractive>
    </CbTooltip>
  </div>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import CbTooltip from '../atoms/CbTooltip.vue'
import type { IconName } from '../atoms/icons'

defineProps<{ label: string; items: { name: string; icon: IconName }[] }>()

// Meldet nur, welcher Knopf geklickt wurde – was er bewirkt, entscheidet der
// Aufrufer.
const emit = defineEmits<{ select: [index: number] }>()
</script>
