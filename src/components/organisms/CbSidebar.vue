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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CbMenu from '../molecules/CbMenu.vue'
import CbMenuItem from '../atoms/CbMenuItem.vue'
import CbAvatarGroup from '../molecules/CbAvatarGroup.vue'
import type { IconName } from '../atoms/icons'
import { usePeopleBroadcast } from '../../presence/usePeopleBroadcast'
import { projectName } from '../../project/project'

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
</script>
