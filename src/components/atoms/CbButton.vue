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

  <!-- "light" is the same button one shade brighter, for use on a surface
       coloured panel where the secondary button would disappear. "ghost" is
       round and carries no background of its own, only the hover. -->
  <CbInteractive
    v-else
    class="flex items-center gap-2.5 p-3 text-sm text-white"
    :class="variantClasses[variant]"
    @click="$emit('click')"
  >
    <slot />
  </CbInteractive>
</template>

<script setup lang="ts">
import CbInteractive from './CbInteractive.vue'

const variantClasses = {
  primary: '',
  secondary: 'bg-surface rounded-xl shadow-lg',
  light: 'bg-surface-light rounded-xl shadow-lg',
  ghost: 'rounded-full',
}

withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'light' | 'ghost' }>(), {
  variant: 'primary',
})
defineEmits<{ click: [] }>()
</script>
