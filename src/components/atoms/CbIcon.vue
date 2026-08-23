<template>
  <component :is="icons[name]" class="h-6 w-6 shrink-0" aria-hidden="true" />
</template>

<script setup lang="ts">
import { icons, type IconName } from './icons'

defineProps<{ name: IconName }>()
</script>
