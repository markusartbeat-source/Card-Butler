<template>
  <!-- „Ordner öffnen“ führt hinein wie ein Doppelklick – auch per Tastatur und
       auf dem Handy. -->
  <CbPanel :title="dictionary.folderViewer.folderSettings">
    <CbButton class="mt-6" @click="emit('openFolder')">
      <CbIcon name="folder_open" />
      {{ dictionary.folderViewer.openFolder }}
    </CbButton>
  </CbPanel>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbPanel from '../components/atoms/CbPanel.vue'

const emit = defineEmits<{ openFolder: [] }>()
</script>
