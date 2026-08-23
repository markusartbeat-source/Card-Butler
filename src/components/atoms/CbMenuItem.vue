<template>
  <CbInteractive
    class="flex w-full items-center gap-1.5 rounded-xl p-2.5 text-white"
    :class="{ 'bg-surface-light': active }"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <CbIcon :name="iconKey" />
    <span class="text-sm">{{ label }}</span>
  </CbInteractive>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import CbInteractive from './CbInteractive.vue'

defineProps<{ iconKey: string; label: string; active?: boolean }>()
defineEmits<{ click: [] }>()
</script>
