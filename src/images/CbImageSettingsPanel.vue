<template>
  <!-- Dasselbe wie die Felder der Drop-Leiste, nur ohne Ziehen – auch per
       Tastatur und auf dem Handy. -->
  <CbPanel :title="dictionary.imageViewer.imageSettings">
    <div class="mt-6 flex flex-col gap-3">
      <!-- Mittig wie die Knöpfe im Ordner-Betrachter. -->
      <CbButton variant="light" class="justify-center" @click="emit('moveIntoNewFolder')">
        <CbIcon name="create_new_folder" />
        {{ dictionary.dropBar.moveIntoNewFolder }}
      </CbButton>
      <CbButton variant="light" class="justify-center" @click="emit('deleteImage')">
        <CbIcon name="delete" />
        {{ dictionary.dropBar.deleteImage }}
      </CbButton>
    </div>
  </CbPanel>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbPanel from '../components/atoms/CbPanel.vue'

const emit = defineEmits<{ moveIntoNewFolder: []; deleteImage: [] }>()
</script>
