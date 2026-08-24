<template>
  <!-- Thin gradient frame around the button, like the sidebar's upgrade button. -->
  <div
    v-if="variant === 'primary'"
    class="bg-gradient-to-br from-gold-dark to-gold-light rounded-xl p-0.5 shadow-lg"
  >
    <CbInteractive
      class="bg-radial from-gold-light to-gold text-surface flex w-full items-center justify-center gap-2.5 rounded-lg p-3 text-sm"
      @click="$emit('click')"
    >
      <slot />
    </CbInteractive>
  </div>

  <CbInteractive
    v-else
    class="bg-surface flex items-center gap-2.5 rounded-xl p-3 text-sm text-white shadow-lg"
    @click="$emit('click')"
  >
    <slot />
  </CbInteractive>
</template>

<script setup lang="ts">
import CbInteractive from './CbInteractive.vue'

withDefaults(defineProps<{ variant?: 'primary' | 'secondary' }>(), { variant: 'primary' })
defineEmits<{ click: [] }>()
</script>
