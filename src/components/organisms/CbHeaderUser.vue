<template>
  <!-- The end of the header: upgrading (or signing in) and the own profile.
       Below laptop width the button leaves the header (it moves into the
       profile menu). -->
  <CbButton class="hidden laptop:block" @click="currentUser ? goToUpgrade() : signInWithGoogle()">
    <CbIcon :name="currentUser ? 'arrow_circle_up' : 'login'" />
    {{ currentUser ? dictionary.general.upgrade : dictionary.general.signIn }}
  </CbButton>

  <CbDropdown :items="profileMenuItems" :active-item="activeMenuEntry" @select="runProfileAction">
    <!-- On one of the profile menu's pages the picture wears a gold ring, the
         same way an open menu above shows its gold underline. -->
    <CbInteractive
      class="rounded-full"
      :class="{ 'outline-2 outline-gold': activeProfileItem }"
    >
      <CbAvatar :name="userLabel" :image-url="userPicture" />
    </CbInteractive>
  </CbDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CbAvatar from '../atoms/CbAvatar.vue'
import CbButton from '../atoms/CbButton.vue'
import CbDropdown, { type DropdownItem } from '../atoms/CbDropdown.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import { signInWithGoogle, signOut, useCurrentUser } from '../../composables/useCurrentUser'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'
import { collaborationPages, headerPageAt, headerPagePath, imagePages } from './headerPages'

const { currentUser, displayName, avatarUrl } = useCurrentUser()

const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// The search comes first (it does nothing yet), then the pages of the header
// menus, then upgrading (or signing in), the same as the button next to the
// picture. Only somebody who is signed in can sign out.
const profileMenuItems = computed<DropdownItem[]>(() => [
  { value: 'search', label: dictionary.header.search, icon: 'search' as const },
  'separator',
  ...imagePages.value,
  'separator',
  ...collaborationPages.value,
  'separator',
  currentUser.value
    ? { value: 'upgrade', label: dictionary.general.upgrade, icon: 'arrow_circle_up' as const }
    : { value: 'signIn', label: dictionary.general.signIn, icon: 'login' as const },
  'separator',
  { value: 'settings', label: dictionary.settings.title, icon: 'settings' as const },
  { value: 'support', label: dictionary.general.support, icon: 'support_agent' as const },
  ...(currentUser.value
    ? [{ value: 'signOut', label: dictionary.general.signOut, icon: 'door_open' as const }]
    : []),
])

const router = useRouter()
const route = useRoute()

// The menu entries that are a page of their own, with the URL they lead to.
const pageByProfileItem: Record<string, string> = {
  upgrade: '/upgrade',
  settings: '/settings',
  support: '/support',
}

// The entry whose page is open right now.
const activeProfileItem = computed(() =>
  Object.keys(pageByProfileItem).find((item) => pageByProfileItem[item] === route.path),
)

// The gold entry in the list: one of the profile's own pages, or one of the
// header pages. The ring around the picture only follows the profile's own
// pages, the header pages already show themselves in their header menu.
const activeMenuEntry = computed(() => activeProfileItem.value ?? headerPageAt(route.path))

function goToUpgrade() {
  router.push(pageByProfileItem.upgrade)
}

function runProfileAction(value: string) {
  const path = pageByProfileItem[value] ?? headerPagePath(value)
  if (path) router.push(path)
  else if (value === 'signIn') signInWithGoogle()
  else if (value === 'signOut') signOut()
  // The search entry only closes the menu for now.
}
</script>
