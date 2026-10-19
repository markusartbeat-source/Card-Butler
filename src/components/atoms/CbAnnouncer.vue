<template>
  <!-- Unsichtbar, aber für Screenreader da. Muss schon vor der ersten Ansage
       auf der Seite stehen, sonst liest der Screenreader sie nicht vor. -->
  <div aria-live="polite" class="sr-only">
    <p :key="announcement.number">{{ announcement.message }}</p>
  </div>
</template>

<script lang="ts">
// Ansagen für Screenreader, ohne dass etwas zu sehen ist. CbAnnouncer steht
// einmal in App.vue, announce geht von überall.
import { ref } from 'vue'

// Die letzte Ansage. Die Nummer gibt jeder Ansage ein eigenes Element, so wird
// auch dieselbe Nachricht zweimal hintereinander vorgelesen.
const announcement = ref({ message: '', number: 0 })

export function announce(message: string) {
  announcement.value = { message, number: announcement.value.number + 1 }
}
</script>

<!-- Leer, aber nötig: Erst damit sieht das Template den Zustand aus dem Block oben. -->
<script setup lang="ts"></script>
