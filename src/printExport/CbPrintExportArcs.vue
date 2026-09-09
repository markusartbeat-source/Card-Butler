<template>
  <!-- The golden sweep around the print button, drawn in one piece. Every
       number is measured from the Figma frame (node 176:9334) in page pixels:
       the drawing is 842 x 82 and its bottom edge is the bottom of the page.
       Both arcs are wide, flat ellipses whose centre sits far below the page,
       so only their very top shows. They are cut to shape by their gradient,
       not by a path: each one is invisible behind the button, jumps to full
       gold exactly where its short vertical stroke stands, and fades out
       towards the page edge. The drawing never scales: only at its drawn size
       do the short strokes keep their distance to the button. -->
  <svg class="text-gold-line" width="842" height="82" viewBox="0 0 842 82" fill="none">
    <defs>
      <linearGradient :id="`${id}-outer`" gradientUnits="userSpaceOnUse" x1="7" x2="835">
        <stop offset="0" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.368" stop-color="currentColor" />
        <stop offset="0.369" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.631" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.632" stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="`${id}-inner`" gradientUnits="userSpaceOnUse" x1="12" x2="830">
        <stop offset="0" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.379" stop-color="currentColor" />
        <stop offset="0.381" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.619" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.621" stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>

      <!-- Each short stroke is bright where it leaves its arc and fades out
           on the way down. -->
      <linearGradient :id="`${id}-thin`" gradientUnits="userSpaceOnUse" x1="0" y1="19" x2="0" y2="58">
        <stop offset="0" stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="`${id}-thick`" gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="0" y2="68">
        <stop offset="0" stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- The shadow the dark dome throws onto the cards above it. It is the
         dome's own ellipse, moved 4px up and blurred. -->
    <ellipse class="cb-dome-shadow fill-background" cx="421" cy="214.5" rx="641.5" ry="202.5" />

    <!-- The outer, thin arc runs exactly along the edge of the dome. -->
    <ellipse
      cx="421"
      cy="223.5"
      rx="651"
      ry="207.5"
      stroke-width="2"
      :stroke="`url(#${id}-outer)`"
    />
    <!-- The inner, thick arc runs a few pixels below it, inside the dome. -->
    <ellipse
      cx="421"
      cy="223.5"
      rx="633.77"
      ry="202.01"
      stroke-width="5"
      :stroke="`url(#${id}-inner)`"
    />

    <path d="M312 19V58" stroke-width="2" stroke-linecap="round" :stroke="`url(#${id}-thin)`" />
    <path d="M530 19V58" stroke-width="2" stroke-linecap="round" :stroke="`url(#${id}-thin)`" />
    <path d="M322.5 24V68" stroke-width="5" stroke-linecap="round" :stroke="`url(#${id}-thick)`" />
    <path d="M519.5 24V68" stroke-width="5" stroke-linecap="round" :stroke="`url(#${id}-thick)`" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue'

// Gradient ids are global to the page, so a second copy of the drawing — one
// shows up while a page transition runs — must not reuse them.
const id = useId()
</script>

<style scoped>
.cb-dome-shadow {
  opacity: 0.2;
  filter: blur(4px);
}
</style>
