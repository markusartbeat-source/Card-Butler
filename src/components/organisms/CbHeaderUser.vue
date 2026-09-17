<template>
  <!-- The end of the header: upgrading (or signing in) and the own profile.
       Below laptop width the button leaves the header (it moves into the
       profile menu). -->
  <CbButton class="hidden laptop:block" @click="currentUser ? goToUpgrade() : signInWithGoogle()">
    <CbIcon :name="currentUser ? 'arrow_circle_up' : 'login'" />
    {{ currentUser ? dictionary.general.upgrade : dictionary.general.signIn }}
  </CbButton>

  <CbDropdown :items="profileMenuItems" :active-item="activeProfileItem" @select="runProfileAction">
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
import { useIsBelowBreakpoint } from '../../composables/useIsBelowBreakpoint'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'
import { collaborationPages, headerPageAt, headerPagePath, imagePages } from './headerPages'

const { currentUser, displayName, avatarUrl } = useCurrentUser()

const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// The header menus leave the header below desktop width, the search and the
// upgrade button below laptop width. Whatever left stands in here instead.
const isBelowLaptop = useIsBelowBreakpoint('laptop')
const isBelowDesktop = useIsBelowBreakpoint('desktop')

// The search does nothing yet.
const searchItems = computed<DropdownItem[]>(() => [
  { value: 'search', label: dictionary.header.search, icon: 'search' as const },
  'separator',
])

const headerPageItems = computed<DropdownItem[]>(() => [
  ...imagePages.value,
  'separator',
  ...collaborationPages.value,
  'separator',
])

const upgradeItems = computed<DropdownItem[]>(() => [
  currentUser.value
    ? { value: 'upgrade', label: dictionary.general.upgrade, icon: 'arrow_circle_up' as const }
    : { value: 'signIn', label: dictionary.general.signIn, icon: 'login' as const },
  'separator',
])

// Only somebody who is signed in can sign out.
const profileMenuItems = computed<DropdownItem[]>(() => [
  ...(isBelowLaptop.value ? searchItems.value : []),
  ...(isBelowDesktop.value ? headerPageItems.value : []),
  ...(isBelowLaptop.value ? upgradeItems.value : []),
  { value: 'settings', label: dictionary.settings.title, icon: 'settings' as const },
  { value: 'support', label: dictionary.general.support, icon: 'support_agent' as const },
  ...(currentUser.value
    ? [{ value: 'signOut', label: dictionary.general.signOut, icon: 'door_open' as const }]
    : []),
])

const router = useRouter()
const route = useRoute()

// The profile's own pages, with the URL they lead to.
const pageByProfileItem: Record<string, string> = {
  settings: '/settings',
  support: '/support',
}

const upgradePath = '/upgrade'

// The entry whose page is open right now. The entries that moved in from the
// header count as well, but only while they are in here — on a wide screen
// the header itself shows where the user is.
const activeProfileItem = computed(() => {
  const ownPage = Object.keys(pageByProfileItem).find(
    (item) => pageByProfileItem[item] === route.path,
  )
  if (ownPage) return ownPage
  if (isBelowLaptop.value && route.path === upgradePath) return 'upgrade'
  if (isBelowDesktop.value) return headerPageAt(route.path)
})

function goToUpgrade() {
  router.push(upgradePath)
}

function runProfileAction(value: string) {
  const path =
    pageByProfileItem[value] ?? (value === 'upgrade' ? upgradePath : headerPagePath(value))
  if (path) router.push(path)
  else if (value === 'signIn') signInWithGoogle()
  else if (value === 'signOut') signOut()
  // The search entry only closes the menu for now.
}
</script>
