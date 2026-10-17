<template>
  <!-- Name und Position bringt der Rahmen mit, die eigentlichen
       Texteinstellungen kommen später. -->
  <CbElementSettingsPanel :element-id="elementId" :title="dictionary.cardEditor.textSettings" />
</template>

<script setup lang="ts">
import CbElementSettingsPanel from '../CbElementSettingsPanel.vue'

defineProps<{ elementId: string }>()
</script>
