<template>
  <button
    type="button"
    class="cb-hover group relative overflow-hidden"
    @mousedown="spawnRipple"
    @click="$emit('click')"
  >
    <span class="group-hover:bg-white/10 pointer-events-none absolute inset-0" />
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="bg-white/40 animate-cb-ripple pointer-events-none absolute rounded-full"
      :style="{ left: `${ripple.x}px`, top: `${ripple.y}px`, width: `${ripple.size}px`, height: `${ripple.size}px` }"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{ click: [] }>()

let nextRippleId = 0
const ripples = ref<{ id: number; x: number; y: number; size: number }[]>([])

function spawnRipple(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const id = nextRippleId++

  ripples.value.push({
    id,
    x: event.clientX - rect.left - size / 2,
    y: event.clientY - rect.top - size / 2,
    size,
  })
  setTimeout(() => {
    ripples.value = ripples.value.filter((ripple) => ripple.id !== id)
  }, 600)
}
</script>
