<template>
  <CbTopbar>
    <template #actions>
      <CbButton @click="showToast('Bilder hinzufügen', 'Diese Funktion gibt es noch nicht.')">
        <CbIcon name="add_2" />
        Bilder hinzufügen
      </CbButton>
      <CbButton variant="secondary" @click="showToast('Mehr', 'Diese Funktion gibt es noch nicht.')">
        <CbIcon name="more_horiz" />
        Mehr
      </CbButton>
    </template>
  </CbTopbar>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbTopbar from '../components/organisms/CbTopbar.vue'
import { showToast } from '../components/atoms/toaster'
</script>
