<template>
  <FocusTrap :set-return-focus="returnFocus">
    <!-- Die Tab-Taste bleibt im Inhalt, solange er da ist. Den Fokus bekommt
         zuerst das Element mit data-autofocus, sonst das erste erreichbare.
         Danach geht er an returnFocusTo zurück, sofern er nicht inzwischen
         woanders steht. Kein Kommentar vor der Wurzel: class, role usw. fallen
         sonst nicht bis zum Element durch. -->
    <slot />
  </FocusTrap>
</template>

<script setup lang="ts">
import { FocusTrap } from '@ark-ui/vue'

// Ohne returnFocusTo geht er dorthin, wo er beim Öffnen stand.
const props = defineProps<{ returnFocusTo?: HTMLElement | null }>()

function returnFocus(focusedBeforeOpening: HTMLElement | SVGElement) {
  return props.returnFocusTo ?? focusedBeforeOpening
}
</script>
