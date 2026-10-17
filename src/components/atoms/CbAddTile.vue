<template>
  <CbInteractive
    class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold p-3 text-center text-gold"
  >
    <!-- Gestrichelte Goldkachel zum Hinzufügen. Größe, Ecken und Klick kommen
         vom Aufrufer. Kein Kommentar vor der Wurzel: Ark legt sich per
         as-child darauf. -->
    <CbIcon :name="icon" />
    <span>{{ label }}</span>
  </CbInteractive>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import CbInteractive from './CbInteractive.vue'
import type { IconName } from './icons'

defineProps<{ icon: IconName; label: string }>()
</script>
