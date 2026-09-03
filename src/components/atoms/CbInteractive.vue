<template>
  <!-- The event is passed on, not swallowed: a wrapper like CbTooltip attaches
       its own click handler here and needs the real event. -->
  <!-- A disabled button swallows the click and the ripple by itself — the
       browser sends it no mouse events at all. Only the hover has to be taken
       off by hand, because :hover still matches a disabled button. -->
  <button
    v-ripple
    type="button"
    :disabled="disabled"
    class="relative overflow-hidden"
    :class="{ 'cb-hover': !disabled }"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>()
defineEmits<{ click: [event: MouseEvent] }>()
</script>
