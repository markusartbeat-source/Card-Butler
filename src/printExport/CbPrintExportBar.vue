<template>
  <!-- The bar stays at the bottom edge while the cards scroll behind it. Only
       the button itself takes clicks, the rest lets the cards through. -->
  <div class="pointer-events-none sticky bottom-0 flex justify-center pb-11">
    <!-- The dark glass the cards disappear into: the top of a wide, flat
         ellipse (Figma node 178:9646, 1283 x 405) whose centre sits far below
         the page, so only 66px of it stick up. It is the very ellipse the outer
         golden arc is drawn on, which is why edge and arc meet exactly. -->
    <div class="cb-print-layer cb-print-dome bg-background/80 absolute inset-x-0 bottom-0"></div>

    <!-- The golden sweep always keeps the size it is drawn at, so the gap
         between the button and the strokes beside it never changes. A page too
         narrow for the whole sweep fades its outer ends out instead of cutting
         them off. -->
    <div class="cb-print-layer cb-print-fade absolute inset-x-0 bottom-0">
      <CbPrintExportArcs class="absolute bottom-0 left-1/2 -translate-x-1/2" />
    </div>

    <CbButton class="cb-print-button pointer-events-auto relative" @click="$emit('open')">
      <CbIcon name="print" />
      {{ dictionary.project.printExport }}
    </CbButton>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbPrintExportArcs from './CbPrintExportArcs.vue'

defineEmits<{ open: [] }>()
</script>

<style scoped>
/* The height the drawing needs: from the top of the button down to the bottom
   of the page. */
.cb-print-layer {
  height: 82px;
}

/* The same ellipse the outer arc is drawn on: 641.5 wide, 202.5 high, its
   centre 136.5 below the bottom edge, which leaves 66 of it sticking up. What
   reaches past the page is cut off by the box itself. */
.cb-print-dome {
  clip-path: ellipse(641.5px 202.5px at 50% calc(100% + 136.5px));
  backdrop-filter: blur(32px);
}

.cb-print-fade {
  mask-image: linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent);
  mask-repeat: no-repeat;
}

/* The button floats above the dome, so it throws its shadow up as well as
   down. */
.cb-print-button {
  box-shadow:
    0 4px 16px rgb(0 0 0 / 0.25),
    0 -4px 16px rgb(0 0 0 / 0.25);
}
</style>
