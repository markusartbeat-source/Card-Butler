<template>
  <li class="bg-surface flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white shadow-lg">
    <CbIcon name="playing_cards" />
    <span class="truncate">{{ name }}</span>
  </li>
</template>

<script setup lang="ts">
import CbIcon from '../atoms/CbIcon.vue'

defineProps<{ name: string }>()
</script>
