<template>
  <!-- Fixed height: an avatar in the trailing slot is taller than the icon and
       would otherwise make this one item jump. -->
  <CbInteractive
    class="flex h-11 w-full items-center gap-1.5 rounded-xl px-2.5 text-white"
    :class="{ 'bg-surface-light': active }"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <CbIcon :name="iconKey" />
    <span class="truncate text-sm">{{ label }}</span>
    <div v-if="$slots.trailing" class="ml-auto flex shrink-0 items-center">
      <slot name="trailing" />
    </div>
  </CbInteractive>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import CbInteractive from './CbInteractive.vue'
import type { IconName } from './icons'

defineProps<{ iconKey: IconName; label: string; active?: boolean }>()
defineEmits<{ click: [] }>()
</script>
