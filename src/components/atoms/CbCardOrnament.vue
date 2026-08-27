<template>
  <!-- Decoration only: a golden ring that is wider than the card and gets cut
       off at the top and bottom, so only its left and right arcs show. -->
  <div
    class="pointer-events-none absolute inset-y-0 left-1/2 w-227 -translate-x-1/2 overflow-hidden"
  >
    <svg
      class="absolute top-1/2 left-0 aspect-square w-full -translate-y-1/2"
      viewBox="0 0 871 871"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="cardOrnamentGold"
          x1="0"
          y1="0"
          x2="0"
          y2="871"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="var(--color-gold-dark)" />
          <stop offset="0.495" stop-color="var(--color-gold-light)" />
          <stop offset="1" stop-color="var(--color-gold-dark)" />
        </linearGradient>
      </defs>

      <g stroke="url(#cardOrnamentGold)">
        <circle :cx="center" :cy="center" r="434.5" stroke-width="2" />
        <circle :cx="center" :cy="center" r="422.5" stroke-width="3" />

        <g class="tick-ring">
          <line v-for="(tick, index) in ticks" :key="index" v-bind="tick" stroke-width="1" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const center = 435.5
const tickOuterRadius = 402.5
const tickInnerRadius = 364.5
const tickCount = 192

// Short marks pointing at the center, spread evenly around the ring.
const ticks = Array.from({ length: tickCount }, (_unused, index) => {
  const angle = (index / tickCount) * 2 * Math.PI

  return {
    x1: center + Math.sin(angle) * tickOuterRadius,
    y1: center - Math.cos(angle) * tickOuterRadius,
    x2: center + Math.sin(angle) * tickInnerRadius,
    y2: center - Math.cos(angle) * tickInnerRadius,
  }
})
</script>

<style scoped>
/* Turns forever, slow enough that it reads as a calm drift. */
.tick-ring {
  transform-box: fill-box;
  transform-origin: center;
  animation: tick-ring-turn 120s linear infinite;
}

@keyframes tick-ring-turn {
  to {
    transform: rotate(360deg);
  }
}
</style>
