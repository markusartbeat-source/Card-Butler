<template>
  <!-- „Ordner öffnen“ führt hinein wie ein Doppelklick, die anderen tun dasselbe
       wie die Felder der Drop-Leiste – auch per Tastatur und auf dem Handy. -->
  <CbPanel :title="dictionary.folderViewer.folderSettings">
    <div class="mt-6 flex flex-col gap-3">
      <CbButton @click="emit('openFolder')">
        <CbIcon name="folder_open" />
        {{ dictionary.folderViewer.openFolder }}
      </CbButton>
      <!-- Mittig wie der goldene Knopf darüber. -->
      <CbButton variant="light" class="justify-center" @click="emit('moveIntoNewFolder')">
        <CbIcon name="create_new_folder" />
        {{ dictionary.dropBar.moveIntoNewFolder }}
      </CbButton>
      <CbButton variant="light" class="justify-center" @click="emit('deleteFolder')">
        <CbIcon name="delete" />
        {{ dictionary.dropBar.deleteFolder }}
      </CbButton>
    </div>
  </CbPanel>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbPanel from '../components/atoms/CbPanel.vue'

const emit = defineEmits<{ openFolder: []; moveIntoNewFolder: []; deleteFolder: [] }>()
</script>
