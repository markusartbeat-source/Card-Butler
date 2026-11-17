<template>
  <span
    class="cb-tiny-text-dark flex items-center gap-0.5 rounded-full bg-white/20 p-0.5 leading-none backdrop-blur-sm text-shadow-2xs text-shadow-black/25"
  >
    <!-- Glass pill from the Figma design: shows how many copies a card is
         printed as, e.g. "x3", with the icon the caller picks. The comment sits
         inside the root on purpose, so a tooltip can wrap the badge (as-child). -->
    <CbIcon :name="icon" size="small" />
    x{{ count }}
  </span>
</template>

<script setup lang="ts">
import CbIcon from './CbIcon.vue'
import type { IconName } from './icons'

defineProps<{ count: number; icon: IconName }>()
</script>
