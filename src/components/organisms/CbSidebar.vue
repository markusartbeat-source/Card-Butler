<template>
  <div class="h-screen w-64 shrink-0 p-3">
    <div class="bg-surface flex h-full w-full flex-col items-center gap-3 rounded-3xl p-3 shadow-lg">
      <img src="../../assets/logos/logo.png" alt="Logo" class="w-10 -rotate-1 drop-shadow-lg" />
      <CbMenu v-model="activeMenuItem" :items="menuItems" />
      <CbMenuItem icon-key="add_2" label="Neues Projekt" @click="createNewProject" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbMenu from '../molecules/CbMenu.vue'
import CbMenuItem from '../atoms/CbMenuItem.vue'

const menuItems = [
  { value: 'home', iconKey: 'home', label: 'Home' },
  { value: 'images', iconKey: 'filter', label: 'Bilder' },
  { value: 'project', iconKey: 'playing_cards', label: 'Mein erstes Projekt' },
]
const activeMenuItem = ref('project')

function createNewProject() {}
</script>
