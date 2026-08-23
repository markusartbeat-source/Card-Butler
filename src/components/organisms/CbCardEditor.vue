<template>
  <!-- Full screen layer that darkens and blurs the page behind it. -->
  <div
    class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    @click.self="emit('close')"
  >
    <CbCard :number="number" shape-classes="h-144 w-96 rounded-3xl" />
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
