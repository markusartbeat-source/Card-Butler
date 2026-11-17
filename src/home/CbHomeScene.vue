<template>
  <!-- Die Bühne bleibt beim Seitenwechsel bestehen und zeigt ihren Inhalt nur
       auf Home. So blendet sie weich aus, statt mit der Seite zu verschwinden. -->
  <Transition v-bind="fade">
    <!-- Hintere Ebene: liegt hinter Header und Seite. -->
    <div v-if="isSceneShown" class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img src="../assets/visuals/Background.png" alt="" class="size-full object-cover blur-sm" />
      <!-- Verlauf ab Header-Unterkante in Hintergrundfarbe: links deckender, damit
           der Text lesbar bleibt. Hell muss er das dunkle Foto stärker und
           weiter abdecken. -->
      <div
        class="from-background/60 light:from-background/90 light:via-background/70 absolute inset-x-0 top-25 bottom-0 bg-linear-to-r to-transparent to-42% light:to-60%"
      />
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
      <div v-if="isSceneShown" class="absolute inset-x-0 top-0 h-25 overflow-hidden">
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
import { useIsBelowBreakpoint } from '../composables/useIsBelowBreakpoint'
import { isHighContrast } from '../theme/theme'

const route = useRoute()
const isBelowTablet = useIsBelowBreakpoint('tablet')
// Auf dem Handy keine Bühne. v-if statt CSS, damit die Bilder dort gar nicht
// erst geladen werden. Wird das Fenster breiter, erscheint sie nachträglich.
// Bei hohem Kontrast auch nicht: Text auf einem Foto erreicht den Kontrast nicht sicher.
const isSceneShown = computed(
  () => route.path === '/home' && !isBelowTablet.value && !isHighContrast.value,
)

// Weiches Ein- und Ausblenden beim Seitenwechsel.
const fade = {
  enterActiveClass: 'transition-opacity duration-500',
  leaveActiveClass: 'transition-opacity duration-500',
  enterFromClass: 'opacity-0',
  leaveToClass: 'opacity-0',
}
</script>
