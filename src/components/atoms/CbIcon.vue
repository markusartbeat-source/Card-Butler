<template>
  <component
    :is="icons[name]"
    class="shrink-0"
    :class="sizeClasses[size]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { icons, type IconName } from './icons'

withDefaults(defineProps<{ name: IconName; size?: 'default' | 'small' | 'large' }>(), {
  size: 'default',
})

// 12, 24 and 32 px — the three icon sizes of the design.
const sizeClasses = { small: 'h-3 w-3', default: 'h-6 w-6', large: 'h-8 w-8' }
</script>
