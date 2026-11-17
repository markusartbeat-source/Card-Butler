<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       No ripple here: a bar is shown, not clicked. -->
  <!-- The bar takes the width it is given, and its empty part is a light veil
       so it stays visible on every background it is placed on. Im
       Kontrastmodus grenzt der Rand der Füllung sie von der leeren Bahn ab. -->
  <Progress.Root :model-value="value" :max="max">
    <Progress.Track class="h-2 w-full overflow-hidden rounded-full bg-highlight/10 ring ring-surface-edge">
      <Progress.Range class="h-full rounded-full bg-gold-light ring ring-surface-edge transition-all duration-300" />
    </Progress.Track>
  </Progress.Root>
</template>

<script setup lang="ts">
import { Progress } from '@ark-ui/vue'

defineProps<{ value: number; max: number }>()
</script>
