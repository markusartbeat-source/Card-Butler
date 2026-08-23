<template>
  <div class="h-screen w-64 shrink-0 p-3">
    <div class="bg-surface flex h-full w-full flex-col items-center gap-3 rounded-3xl p-3 shadow-lg">
      <img src="../../assets/logos/logo.png" alt="Logo" class="w-10 -rotate-1 drop-shadow-lg" />
      <div class="flex w-full flex-col gap-1">
        <CbMenu v-model="activeMenuItem" :items="menuItems" />
        <CbMenuItem icon-key="add_2" label="Neues Projekt" @click="createNewProject" />
      </div>
      <div class="bg-gradient-to-br from-gold-dark to-gold-light mt-auto w-full rounded-xl p-0.5 shadow-lg">
        <button
          type="button"
          class="bg-radial from-gold-light to-gold text-surface flex w-full items-center justify-center gap-2.5 rounded-lg p-2 text-sm"
          @click="upgrade"
        >
          <CbIcon name="arrow_circle_up" />
          Upgrade
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbMenu from '../molecules/CbMenu.vue'
import CbMenuItem from '../atoms/CbMenuItem.vue'
import CbIcon from '../atoms/CbIcon.vue'

const menuItems = [
  { value: 'home', iconKey: 'home', label: 'Home' },
  { value: 'images', iconKey: 'filter', label: 'Bilder' },
  { value: 'project', iconKey: 'playing_cards', label: 'Mein erstes Projekt' },
]
const activeMenuItem = ref('project')

function createNewProject() {}

function upgrade() {}
</script>
