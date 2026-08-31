<template>
  <component
    :is="icons[name]"
    class="shrink-0"
    :class="size === 'small' ? 'h-3 w-3' : 'h-6 w-6'"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { icons, type IconName } from './icons'

defineProps<{ name: IconName; size?: 'default' | 'small' }>()
</script>
