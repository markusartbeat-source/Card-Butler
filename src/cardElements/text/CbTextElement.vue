<template>
  <span class="text-background">{{ content }}</span>
</template>

<script setup lang="ts">
// The content is the one thing each card fills in itself.
defineProps<{ content?: string }>()
</script>
