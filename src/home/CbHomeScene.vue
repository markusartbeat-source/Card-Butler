<template>
  <!-- Die Bühne bleibt beim Seitenwechsel bestehen und zeigt ihren Inhalt nur
       auf Home. So blendet sie weich aus, statt mit der Seite zu verschwinden. -->
  <Transition v-bind="fade">
    <!-- Hintere Ebene: liegt hinter Header und Seite. -->
    <div v-if="isHome" class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img src="../assets/visuals/Background.png" alt="" class="size-full object-cover blur-sm" />
      <!-- Blauer Verlauf ab Header-Unterkante: links dunkler, damit der Text lesbar bleibt. -->
      <div class="from-background/60 absolute inset-x-0 top-25 bottom-0 bg-linear-to-r to-transparent to-42%" />
      <!-- Tisch mit Fuchs, volle Breite. Um ein Siebtel seiner Höhe nach oben
           geschoben (Figma: 178 von 1257px), so ragt das Ohr über den Header.
           Hier hinten, damit der Seiteninhalt (z.B. die Projektliste) davor liegt. -->
      <img
        src="../assets/visuals/table_with_fox.png"
        alt=""
        class="absolute inset-x-0 top-0 w-full -translate-y-1/7"
      />
    </div>
  </Transition>

  <!-- Vordere Ebene: liegt über dem Header, Klicks gehen hindurch. -->
  <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    <Transition v-bind="fade">
      <!-- Derselbe Tisch noch einmal, aber nur auf Header-Höhe (100px)
           sichtbar: So liegt das Ohr über dem Header, verdeckt aber nichts
           von der Seite darunter. Nahtlos, weil beide gleich liegen. -->
      <div v-if="isHome" class="absolute inset-x-0 top-0 h-25 overflow-hidden">
        <img
          src="../assets/visuals/table_with_fox.png"
          alt=""
          class="absolute inset-x-0 top-0 w-full -translate-y-1/7"
        />
      </div>
    </Transition>

    <!-- Platz für spätere Karten auf dem Tisch: liegen über Tisch und Fuchs und
         brauchen pointer-events-auto, damit sie klickbar sind. -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/home')

// Weiches Ein- und Ausblenden beim Seitenwechsel.
const fade = {
  enterActiveClass: 'transition-opacity duration-500',
  leaveActiveClass: 'transition-opacity duration-500',
  enterFromClass: 'opacity-0',
  leaveToClass: 'opacity-0',
}
</script>
