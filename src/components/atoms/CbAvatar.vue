<template>
  <Avatar.Root class="bg-surface flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
    <Avatar.Fallback class="text-sm text-white">{{ initials }}</Avatar.Fallback>
  </Avatar.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@ark-ui/vue'

const props = defineProps<{ name: string }>()

const initials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
)
</script>
