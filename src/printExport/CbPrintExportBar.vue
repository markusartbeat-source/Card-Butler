<template>
  <!-- The bar stays at the bottom edge while the cards scroll behind it. Only
       the button itself takes clicks, the rest lets the cards through. -->
  <div class="pointer-events-none sticky bottom-0 flex justify-center p-4">
    <CbButton class="pointer-events-auto" @click="$emit('open')">
      <CbIcon name="print" />
      {{ dictionary.project.printExport }}
    </CbButton>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'

defineEmits<{ open: [] }>()
</script>
