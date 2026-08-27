<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       No ripple here: a bar is shown, not clicked. -->
  <Progress.Root :model-value="value" :max="max">
    <Progress.Track class="h-2 w-52 overflow-hidden rounded-full bg-surface-light">
      <Progress.Range class="h-full rounded-full bg-gold-light transition-all duration-300" />
    </Progress.Track>
  </Progress.Root>
</template>

<script setup lang="ts">
import { Progress } from '@ark-ui/vue'

defineProps<{ value: number; max: number }>()
</script>
