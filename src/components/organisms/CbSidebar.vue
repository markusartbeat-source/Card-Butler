<template>
  <div class="h-screen w-64 shrink-0 p-3">
    <div class="bg-surface flex h-full w-full flex-col items-center gap-3 rounded-3xl p-3 shadow-lg">
      <img
        src="../../assets/logos/logo.svg"
        alt="Logo"
        class="aspect-square w-10 -rotate-1 object-cover drop-shadow-lg"
      />
      <div class="flex w-full flex-col gap-1">
        <CbMenu :model-value="activeMenuItem" :items="menuItems" @update:model-value="selectMenuItem">
          <template #trailing="{ item }">
            <span class="truncate text-xs text-white">{{ namesInArea(item.value) }}</span>
          </template>
        </CbMenu>
        <CbMenuItem icon-key="add_2" label="Neues Projekt" @click="createNewProject" />
      </div>
      <div class="bg-gradient-to-br from-gold-dark to-gold-light mt-auto w-full rounded-xl p-0.5 shadow-lg">
        <CbInteractive
          class="bg-radial from-gold-light to-gold text-surface flex w-full items-center justify-center gap-2.5 rounded-lg p-2 text-sm"
          @click="currentUser ? upgrade() : signInWithGoogle()"
        >
          <CbIcon :name="currentUser ? 'arrow_circle_up' : 'login'" />
          {{ currentUser ? 'Upgrade' : 'Anmelden' }}
        </CbInteractive>
      </div>
      <CbInteractive
        class="bg-surface-light flex w-full items-center justify-between gap-1.5 rounded-xl p-2.5 text-white shadow-lg"
        @click="openUserPanel"
      >
        <div class="flex items-center gap-1.5">
          <CbAvatar :name="userLabel" :image-url="userPicture" />
          <span class="text-sm">{{ userLabel }}</span>
        </div>
        <CbIcon name="settings" />
      </CbInteractive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CbMenu from '../molecules/CbMenu.vue'
import CbMenuItem from '../atoms/CbMenuItem.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbAvatar from '../atoms/CbAvatar.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import type { IconName } from '../atoms/icons'
import { signInWithGoogle, useCurrentUser } from '../../composables/useCurrentUser'
import { usePresence } from '../../presence/usePresence'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'

const { currentUser, displayName, avatarUrl } = useCurrentUser()

const userLabel = computed(() => displayName.value ?? 'Gast')
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

const { people } = usePresence()

function namesInArea(area: string) {
  return Object.values(people.value)
    .filter((person) => person.area === area)
    .map((person) => person.name)
    .join(', ')
}

const menuItems: { value: string; iconKey: IconName; label: string }[] = [
  { value: 'home', iconKey: 'home', label: 'Home' },
  { value: 'images', iconKey: 'filter', label: 'Bilder' },
  { value: 'project', iconKey: 'playing_cards', label: 'Mein erstes Projekt' },
]

const route = useRoute()
const router = useRouter()

function pathForMenuValue(value: string) {
  return `/${value}`
}

const activeMenuItem = computed(
  () => menuItems.find((item) => pathForMenuValue(item.value) === route.path)?.value ?? '',
)

function selectMenuItem(value: string) {
  router.push(pathForMenuValue(value))
}

function createNewProject() {}

function upgrade() {
  router.push('/upgrade')
}

function openUserPanel() {
  router.push('/settings')
}
</script>
