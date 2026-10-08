<template>
  <!-- Die Bühne bleibt beim Seitenwechsel bestehen und zeigt ihren Inhalt nur
       auf Home. So blendet sie weich aus, statt mit der Seite zu verschwinden. -->
  <Transition
    enter-active-class="transition-opacity duration-500"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <!-- Hintere Ebene: liegt hinter Header und Seite. -->
    <div v-if="isHome" class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img src="../assets/visuals/Background.png" alt="" class="size-full object-cover blur-sm" />
    </div>
  </Transition>

  <!-- Vordere Ebene: liegt über dem Header, Klicks gehen hindurch. -->
  <div class="pointer-events-none absolute inset-0 z-20" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/home')
</script>
