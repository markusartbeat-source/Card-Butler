<template>
  <!-- What the export toast looks like while the cards are being photographed:
       the headline and, 8 px below it, the golden bar. -->
  <div class="flex w-full flex-col gap-2">
    <span class="text-sm font-medium">{{ dictionary.exportDialog.pngExportToastTitle }}</span>
    <CbProgress :value="value" :max="max" />
  </div>
</template>

<script setup lang="ts">
import CbProgress from '../components/atoms/CbProgress.vue'

defineProps<{ value: number; max: number }>()
</script>
