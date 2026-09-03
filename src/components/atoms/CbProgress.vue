<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       No ripple here: a bar is shown, not clicked. -->
  <!-- The bar takes the width it is given, and its empty part is a light veil
       so it stays visible on every background it is placed on. -->
  <Progress.Root :model-value="value" :max="max">
    <Progress.Track class="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <Progress.Range class="h-full rounded-full bg-gold-light transition-all duration-300" />
    </Progress.Track>
  </Progress.Root>
</template>

<script setup lang="ts">
import { Progress } from '@ark-ui/vue'

defineProps<{ value: number; max: number }>()
</script>
