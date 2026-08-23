<template>
  <!-- Full screen layer that darkens and blurs the page behind it. -->
  <div
    class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    @click.self="emit('close')"
  >
    <!-- Perspective makes the spin look spatial instead of flat. -->
    <div class="perspective-distant">
      <CbCard :number="number" shape-classes="h-144 w-96 rounded-3xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import CbCard from '../atoms/CbCard.vue'

defineProps<{ number: number }>()

const emit = defineEmits<{ close: [] }>()

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<style scoped>
/* The face is rotated, not the outer card, so the sort library's own
   transform stays untouched. */
:deep(.cb-card) {
  transform-style: preserve-3d;
}

:deep(.cb-card-face) {
  animation: card-open-spin 900ms ease-out;
}

@keyframes card-open-spin {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
</style>
