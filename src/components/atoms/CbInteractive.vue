<template>
  <!-- The event is passed on, not swallowed: a wrapper like CbTooltip attaches
       its own click handler here and needs the real event. -->
  <button
    v-ripple
    type="button"
    class="cb-hover relative overflow-hidden"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{ click: [event: MouseEvent] }>()
</script>
