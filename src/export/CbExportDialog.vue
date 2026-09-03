<template>
  <!-- The window for choosing an export format. The formats themselves come
       in the next steps. -->
  <CbDialog
    :open="open"
    :title="dictionary.project.export"
    @update:open="$emit('update:open', $event)"
  />
</template>

<script setup lang="ts">
import CbDialog from '../components/atoms/CbDialog.vue'

defineProps<{ open: boolean }>()
defineEmits<{ 'update:open': [open: boolean] }>()
</script>
