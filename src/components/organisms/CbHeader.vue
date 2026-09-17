<template>
  <!-- Height and side spacing come from the design: 100px tall, 24px inset. -->
  <div class="flex h-25 w-full shrink-0 items-center gap-2.5 px-6">
    <!-- Left side is as wide as the right side, so the search stays centered. -->
    <div class="flex min-w-0 flex-1 items-center gap-2.5">
      <!-- The back button belongs to the heading, so it only shows with one.
           A long title never wraps, it ends in "..." instead. min-w-0 lets
           the heading shrink below its text width, which flex items refuse
           to do by default. -->
      <template v-if="title">
        <CbButton variant="icon" @click="router.back()">
          <CbIcon name="west" />
        </CbButton>
        <h1 class="min-w-0 truncate text-xl text-white">{{ title }}</h1>
      </template>

      <!-- Everybody who is in the project right now, next to the project name. -->
      <CbAvatarGroup :people="peopleHere" size="small" />
    </div>

    <!-- Below laptop width the search leaves the header (it moves into the
         profile menu). -->
    <div
      v-if="searchbar"
      class="bg-surface hidden w-96 items-center rounded-full text-white shadow-lg laptop:flex"
    >
      <!-- The typing happens here, the icons next to it only switch the mode.
           The label carries hover and ripple, because those need a child
           element and an input cannot have one. -->
      <label
        v-ripple
        class="cb-hover relative flex min-w-0 flex-1 items-center self-stretch overflow-hidden rounded-l-full pl-6"
      >
        <input
          v-model="searchWord"
          class="w-full min-w-0 cursor-text bg-transparent text-sm text-white outline-none placeholder:text-label focus:placeholder:text-transparent"
          :placeholder="searchModeLabel"
        />
      </label>
      <div class="flex gap-0.5 p-1.5">
        <!-- The X only appears once there is something to clear. -->
        <CbInteractive
          v-if="searchWord"
          class="rounded-full p-2 text-white"
          @click="clearSearchWord()"
        >
          <CbIcon name="close" />
        </CbInteractive>
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

    <!-- Only from laptop width both sides are equal (that centers the search).
         Below, the right side is as wide as its content, so the title keeps
         its room. -->
    <div class="flex items-center justify-end gap-3 laptop:flex-1">
      <!-- The three menus of the design. They open the same list as every other
           menu in the header, the one of the profile included. Below laptop
           width only the cards menu stays, the others move into the profile
           menu. -->
      <CbDropdown
        v-for="menu in navigationMenus"
        :key="menu.value"
        :items="menu.items"
        :active-item="activeItemOf(menu.items)"
        @select="runMenuAction"
      >
        <CbButton
          variant="ghost"
          class="cb-header-menu"
          :class="{
            'cb-header-menu-active': activeItemOf(menu.items),
            'hidden laptop:flex': menu.value !== 'cards',
          }"
        >
          {{ menu.label }}
          <CbIcon name="keyboard_arrow_down" class="cb-header-menu-arrow" />
        </CbButton>
      </CbDropdown>

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
import { useRoute, useRouter } from 'vue-router'
import CbButton from '../atoms/CbButton.vue'
import CbDropdown from '../atoms/CbDropdown.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import CbAvatarGroup from '../molecules/CbAvatarGroup.vue'
import CbHeaderUser from './CbHeaderUser.vue'
import { usePeopleBroadcast } from '../../presence/usePeopleBroadcast'
import { addCardSet, cardSetIdToShow, cardSets } from '../../cardSets/cardSets'
import { visibleCardSetId } from '../../cardSets/visibleCardSet'
import { clearSearchWord, searchWord } from '../../search/searchWord'
import type { HeaderButton } from './headerButton'
import { collaborationPages, headerPageAt, headerPagePath, imagePages } from './headerPages'

withDefaults(defineProps<{ title?: string; searchbar?: boolean; buttons?: HeaderButton[] }>(), {
  searchbar: true,
  buttons: () => [],
})
const emit = defineEmits<{ action: [key: string] }>()

const router = useRouter()
const route = useRoute()

// The entry whose page is open right now. Only one menu holds it at a time, so
// the user always sees where they are. On the project page that is the set
// the user is looking at.
const activeMenuItem = computed(() =>
  route.path === '/project' ? visibleCardSetId.value : headerPageAt(route.path),
)

function activeItemOf(menuItems: { value: string }[]) {
  return menuItems.find((item) => item.value === activeMenuItem.value)?.value
}

// A set (new or existing) is shown on the project page, an entry with a page
// opens it, every other entry is left to the page.
function runMenuAction(value: string) {
  if (value === 'new-card-set') {
    cardSetIdToShow.value = addCardSet().id
    router.push('/project')
    return
  }

  if (cardSets.value.some((cardSet) => cardSet.id === value)) {
    cardSetIdToShow.value = value
    router.push('/project')
    return
  }

  const path = headerPagePath(value)
  if (path) router.push(path)
  else emit('action', value)
}

// The menus of the design. They belong to the header itself, so they stand in
// every page.
const navigationMenus = computed(() => [
  {
    value: 'cards',
    label: dictionary.header.cards,
    items: [
      // Every card set stands here with its own name, the last entry adds one.
      ...cardSets.value.map((cardSet) => ({
        value: cardSet.id,
        label: cardSet.name,
        icon: 'playing_cards' as const,
      })),
      { value: 'new-card-set', label: dictionary.header.newCardSet, icon: 'add_2' as const },
    ],
  },
  { value: 'images', label: dictionary.images.title, items: imagePages.value },
  { value: 'collaboration', label: dictionary.header.collaboration, items: collaborationPages.value },
])

// Each search mode has its own icon button and its own text in the pill.
const searchModeNames = ['search', 'forum'] as const

const activeSearchMode = ref<(typeof searchModeNames)[number]>('search')

const searchModeLabel = computed(() =>
  activeSearchMode.value === 'search'
    ? dictionary.header.searchInCards
    : dictionary.header.askButler,
)

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

<style scoped>
/* Ark UI marks the open menu on its trigger. The button stays lit as long as
   its list is open, and its arrow points at the list below. */
.cb-header-menu[data-state='open'] {
  background-color: var(--color-surface);
}

.cb-header-menu[data-state='open'] .cb-header-menu-arrow {
  rotate: 180deg;
}

.cb-header-menu-arrow {
  transition: rotate 250ms ease;
}

/* The menu the user is in is gold and carries a straight gold line under its
   label. The line is drawn as its own element, not as a border: the button is
   rounded and clips its content, so a border would bend up at the corners. The
   line starts inside the corner radius (8px, the button's padding) and so stays
   straight. It is a ::before, because ::after already belongs to the hover
   lightening of cb-hover. */
.cb-header-menu-active {
  color: var(--color-gold);
}

.cb-header-menu-active::before {
  content: '';
  position: absolute;
  right: 8px;
  bottom: 0;
  left: 8px;
  height: 2px;
  background-color: var(--color-gold);
}
</style>
