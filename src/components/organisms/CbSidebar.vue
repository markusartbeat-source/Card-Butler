<template>
  <div class="h-screen w-64 shrink-0 p-3">
    <div class="bg-surface flex h-full w-full flex-col items-center gap-3 rounded-3xl p-3 shadow-lg">
      <img
        src="../../assets/logos/logo.svg"
        :alt="dictionary.sidebar.logoAlt"
        class="aspect-square w-10 -rotate-1 object-cover drop-shadow-lg"
      />
      <div class="flex w-full flex-col gap-1">
        <CbMenu :model-value="activeMenuItem" :items="menuItems" @update:model-value="selectMenuItem">
          <template #trailing="{ item }">
            <CbAvatarGroup :people="peopleInArea(item.value)" />
          </template>
        </CbMenu>
        <CbMenuItem
          icon-key="add_2"
          :label="dictionary.sidebar.newProject"
          @click="createNewProject"
        />
      </div>
      <CbButton class="mt-auto w-full" @click="currentUser ? upgrade() : signInWithGoogle()">
        <CbIcon :name="currentUser ? 'arrow_circle_up' : 'login'" />
        {{ currentUser ? dictionary.general.upgrade : dictionary.general.signIn }}
      </CbButton>
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
import CbButton from '../atoms/CbButton.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbAvatar from '../atoms/CbAvatar.vue'
import CbAvatarGroup from '../molecules/CbAvatarGroup.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import type { IconName } from '../atoms/icons'
import { signInWithGoogle, useCurrentUser } from '../../composables/useCurrentUser'
import { usePeopleBroadcast } from '../../presence/usePeopleBroadcast'
import { projectName } from '../../project/project'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'

const { currentUser, displayName, avatarUrl } = useCurrentUser()

const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

const { people } = usePeopleBroadcast()

function peopleInArea(area: string) {
  return Object.entries(people.value)
    .filter(([, person]) => person.area === area)
    .map(([id, person]) => ({
      id,
      name: person.name,
      imageUrl: person.pictureUrl,
      color: person.color,
    }))
}

const menuItems = computed<{ value: string; iconKey: IconName; label: string }[]>(() => [
  { value: 'home', iconKey: 'home', label: dictionary.sidebar.home },
  { value: 'images', iconKey: 'filter', label: dictionary.sidebar.images },
  { value: 'project', iconKey: 'playing_cards', label: projectName.value },
])

const route = useRoute()
const router = useRouter()

function pathForMenuValue(value: string) {
  return `/${value}`
}

const activeMenuItem = computed(
  () => menuItems.value.find((item) => pathForMenuValue(item.value) === route.path)?.value ?? '',
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
