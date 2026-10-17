<template>
  <!-- Ein Icon-Knopf in einer Reihe: dünne Linie zum linken Nachbarn, runde
       Ecken nur außen. Tooltips legen eigene Elemente neben die Knöpfe – deshalb
       zählen Linien und runde Enden nur die Knöpfe selbst (*-of-type).
       Klick, Name (aria-label) und alles Weitere gehen direkt an den Knopf. -->
  <CbInteractive
    class="flex flex-1 justify-center border-l border-surface py-1 text-white first-of-type:rounded-l-md first-of-type:border-l-0 last-of-type:rounded-r-md"
  >
    <CbIcon :name="icon" />
  </CbInteractive>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import CbInteractive from './CbInteractive.vue'
import type { IconName } from './icons'

defineProps<{ icon: IconName }>()
</script>
