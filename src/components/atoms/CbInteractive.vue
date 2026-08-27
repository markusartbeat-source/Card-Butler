<template>
  <button v-ripple type="button" class="cb-hover relative overflow-hidden" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{ click: [] }>()
</script>
