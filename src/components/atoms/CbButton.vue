<template>
  <!-- Thin gradient frame around the button, like the sidebar's upgrade button. -->
  <div
    v-if="variant === 'primary'"
    class="bg-gradient-to-br from-gold-dark to-gold-light rounded-xl p-0.5 shadow-lg"
  >
    <CbInteractive
      class="bg-radial from-gold-light to-gold text-surface flex w-full items-center justify-center gap-2.5 rounded-lg p-2 text-sm"
      @click="$emit('click', $event)"
    >
      <slot />
    </CbInteractive>
  </div>

  <!-- "light" is the same button one shade brighter, for use on a surface
       coloured panel where the secondary button would disappear. "ghost" is
       round and carries no background of its own, only the hover. The extra
       padding makes up for the missing gradient frame, so every variant ends
       up as high as the sidebar's upgrade button. "small" tightens that
       padding for a button that sits next to text instead of on its own. -->
  <CbInteractive
    v-else
    class="flex items-center gap-2.5 text-sm text-white"
    :class="[variantClasses[variant], size === 'small' ? 'p-1' : 'p-2.5']"
    @click="$emit('click', $event)"
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

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'light' | 'ghost'
    size?: 'default' | 'small'
  }>(),
  { variant: 'primary', size: 'default' },
)
defineEmits<{ click: [event: MouseEvent] }>()
</script>
