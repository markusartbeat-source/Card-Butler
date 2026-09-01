<template>
  <span v-ripple class="cb-hover text-background relative overflow-hidden rounded px-1">
    {{ content }}
  </span>
</template>

<script setup lang="ts">
// The content is the one thing each card fills in itself.
defineProps<{ content?: string }>()
</script>
