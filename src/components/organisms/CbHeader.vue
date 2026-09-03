<template>
  <!-- Height and side spacing come from the design: 100px tall, 24px inset. -->
  <div class="flex h-25 w-full shrink-0 items-center gap-2.5 px-6">
    <!-- Left side is as wide as the right side, so the search stays centered. -->
    <div class="flex flex-1 items-center gap-2.5">
      <!-- The back button belongs to the heading, so it only shows with one. -->
      <template v-if="title">
        <CbButton variant="ghost" @click="router.back()">
          <CbIcon name="west" />
        </CbButton>
        <h1 class="text-2xl text-white">{{ title }}</h1>
      </template>

      <!-- Everybody who is in the project right now, next to the project name. -->
      <CbAvatarGroup :people="peopleHere" size="small" />
    </div>

    <div v-if="searchbar" class="bg-surface flex w-96 items-center rounded-full text-white shadow-lg">
      <!-- The text area opens the search later, the icons only switch the mode. -->
      <CbInteractive
        class="flex flex-1 items-center self-stretch rounded-l-full pl-6 text-left text-sm"
        @click="showToast(searchModeLabel, dictionary.general.notAvailableText)"
      >
        {{ searchModeLabel }}
      </CbInteractive>
      <div class="flex gap-0.5 p-1.5">
        <CbInteractive
          v-for="mode in searchModeNames"
          :key="mode"
          class="rounded-full p-2 text-white"
          :class="{ 'bg-surface-light': mode === activeSearchMode }"
          @click="activeSearchMode = mode"
        >
          <CbIcon :name="mode" />
        </CbInteractive>
      </div>
    </div>

    <div class="flex flex-1 items-center justify-end gap-3">
      <CbNavigationMenu :menus="navigationMenus" @select="$emit('action', $event)" />

      <template v-for="button in buttons" :key="button.key">
        <CbDropdown
          v-if="button.menuItems"
          :items="button.menuItems"
          @select="$emit('action', $event)"
        >
          <CbButton :variant="button.variant">
            <CbIcon v-if="button.icon" :name="button.icon" />
            {{ button.label }}
          </CbButton>
        </CbDropdown>

        <CbButton v-else :variant="button.variant" @click="$emit('action', button.key)">
          <CbIcon v-if="button.icon" :name="button.icon" />
          {{ button.label }}
        </CbButton>
      </template>

      <CbHeaderUser />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CbButton from '../atoms/CbButton.vue'
import CbDropdown from '../atoms/CbDropdown.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import CbNavigationMenu from '../atoms/CbNavigationMenu.vue'
import CbAvatarGroup from '../molecules/CbAvatarGroup.vue'
import CbHeaderUser from './CbHeaderUser.vue'
import { showToast } from '../atoms/toaster'
import { usePeopleBroadcast } from '../../presence/usePeopleBroadcast'
import type { HeaderButton } from './headerButton'

withDefaults(defineProps<{ title?: string; searchbar?: boolean; buttons?: HeaderButton[] }>(), {
  searchbar: true,
  buttons: () => [],
})
defineEmits<{ action: [key: string] }>()

// The three menus of the design. They belong to the header itself, so they
// stand in every page. Their entries are placeholders until it is decided what
// goes in them — only "export" already does something.
const navigationMenus = computed(() => {
  const description = dictionary.general.placeholderDescription

  const placeholderLinks = [
    {
      value: 'placeholder-one',
      title: dictionary.general.placeholderOne,
      description,
      icon: 'circle' as const,
    },
    {
      value: 'placeholder-two',
      title: dictionary.general.placeholderTwo,
      description,
      icon: 'circle' as const,
    },
    {
      value: 'placeholder-three',
      title: dictionary.general.placeholderThree,
      description,
      icon: 'circle' as const,
    },
  ]

  return [
    {
      value: 'images',
      label: dictionary.images.title,
      groups: [{ label: dictionary.images.title, links: placeholderLinks }],
    },
    {
      value: 'collaboration',
      label: dictionary.header.collaboration,
      groups: [{ label: dictionary.header.collaboration, links: placeholderLinks }],
    },
    {
      value: 'more',
      label: dictionary.general.more,
      groups: [
        {
          label: dictionary.general.more,
          links: [
            {
              value: 'export',
              title: dictionary.project.export,
              description,
              icon: 'download' as const,
            },
            ...placeholderLinks,
          ],
        },
      ],
    },
  ]
})

// Each search mode has its own icon button and its own text in the pill.
const searchModeNames = ['search', 'forum'] as const

const activeSearchMode = ref<(typeof searchModeNames)[number]>('search')

const searchModeLabel = computed(() =>
  activeSearchMode.value === 'search'
    ? dictionary.header.searchInCards
    : dictionary.header.askButler,
)

const router = useRouter()

const { people } = usePeopleBroadcast()

const peopleHere = computed(() =>
  Object.entries(people.value).map(([id, person]) => ({
    id,
    name: person.name,
    imageUrl: person.pictureUrl,
    color: person.color,
  })),
)
</script>
