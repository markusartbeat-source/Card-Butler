<template>
  <!-- An avatar is 2.5rem wide, the small one 1.75rem. -->
  <Avatar.Root
    class="bg-surface flex shrink-0 items-center justify-center overflow-hidden rounded-full"
    :class="size === 'small' ? 'size-7' : 'size-10'"
    :style="color ? { backgroundColor: color } : undefined"
  >
    <Avatar.Fallback :class="size === 'small' ? 'text-xs' : 'text-sm'" class="text-white">
      {{ initials }}
    </Avatar.Fallback>
    <Avatar.Image v-if="imageUrl" :src="imageUrl" :alt="name" class="size-full object-cover" />
  </Avatar.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '@ark-ui/vue'

const props = withDefaults(
  defineProps<{
    name: string
    imageUrl?: string
    color?: string
    size?: 'default' | 'small'
  }>(),
  {
    imageUrl: undefined,
    color: undefined,
    size: 'default',
  },
)

const initials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
)
</script>
