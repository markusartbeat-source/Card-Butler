<template>
  <Avatar.Root
    class="bg-surface flex shrink-0 items-center justify-center overflow-hidden rounded-full"
    :class="size === 'small' ? 'size-7' : 'size-12'"
  >
    <Avatar.Fallback class="text-sm text-white">{{ initials }}</Avatar.Fallback>
    <Avatar.Image v-if="imageUrl" :src="imageUrl" :alt="name" class="size-full object-cover" />
  </Avatar.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@ark-ui/vue'

const props = withDefaults(
  defineProps<{ name: string; imageUrl?: string; size?: 'small' | 'medium' }>(),
  { imageUrl: undefined, size: 'medium' },
)

const initials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
)
</script>
