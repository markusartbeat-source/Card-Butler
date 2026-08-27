<template>
  <!-- A check mark followed by a short text, used for benefit lists. -->
  <p class="flex items-center gap-2 text-white">
    <CbIcon name="check" />
    <span>{{ text }}</span>
  </p>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'

defineProps<{ text: string }>()
</script>
