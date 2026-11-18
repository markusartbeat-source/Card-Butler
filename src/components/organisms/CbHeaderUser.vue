<template>
  <!-- The end of the header: upgrading (or signing in) and the own profile.
       Below laptop width the button leaves the header (it moves into the
       profile menu). -->
  <CbButton
    v-if="showsUpgradeOrSignIn"
    class="hidden laptop:block"
    @click="currentUser ? goToUpgrade() : postOffice.user.signInWithGoogle()"
  >
    <CbIcon :name="currentUser ? 'arrow_circle_up' : 'login'" />
    {{ currentUser ? dictionary.general.upgrade : dictionary.general.signIn }}
  </CbButton>

  <CbDropdown :items="profileMenuItems" :active-item="activeProfileItem" @select="runProfileAction">
    <!-- On one of the profile menu's pages the picture wears a gold ring, the
         same way an open menu above shows its gold underline. -->
    <CbInteractive
      class="rounded-full"
      :class="{ 'outline-2 outline-accent': activeProfileItem }"
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
import { postOffice } from '../../api/postOffice/postOffice'
import { signOut, useCurrentUser } from '../../composables/useCurrentUser'
import { useIsBelowBreakpoint } from '../../composables/useIsBelowBreakpoint'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'
import {
  collaborationDialogs,
  headerDialogAt,
  headerDialogRoute,
  imageDialogs,
  isProfileDialog,
  profileDialogs,
} from './headerDialogs'

const router = useRouter()
const route = useRoute()

const { currentUser, displayName, avatarUrl } = useCurrentUser()

// Im Projekt gibt es kein Upgrade, weder als Knopf noch im Menü. Anmelden für
// Gäste bleibt.
const showsUpgradeOrSignIn = computed(() => !currentUser.value || !route.params.projectId)

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

const headerMenuItems = computed<DropdownItem[]>(() => [
  ...imageDialogs.value,
  'separator',
  ...collaborationDialogs.value,
  'separator',
])

const upgradeItems = computed<DropdownItem[]>(() => [
  currentUser.value
    ? { value: 'upgrade', label: dictionary.general.upgrade, icon: 'arrow_circle_up' as const }
    : { value: 'signIn', label: dictionary.general.signIn, icon: 'login' as const },
  'separator',
])

// Only somebody who is signed in can sign out. Abmelden steht abgesetzt und rot.
const profileMenuItems = computed<DropdownItem[]>(() => [
  ...(isBelowLaptop.value ? searchItems.value : []),
  ...(isBelowDesktop.value ? headerMenuItems.value : []),
  ...(isBelowLaptop.value && showsUpgradeOrSignIn.value ? upgradeItems.value : []),
  ...profileDialogs.value,
  ...(currentUser.value
    ? [
        'separator' as const,
        {
          value: 'signOut',
          label: dictionary.general.signOut,
          icon: 'door_open' as const,
          danger: true,
        },
      ]
    : []),
])

const upgradePath = '/upgrade'

// The entry whose dialog or page is open right now. The entries that moved in
// from the header count as well, but only while they are in here — on a wide
// screen the header itself shows where the user is.
const activeProfileItem = computed(() => {
  const openDialog = headerDialogAt(route)
  if (openDialog && (isProfileDialog(openDialog) || isBelowDesktop.value)) return openDialog.value
  if (isBelowLaptop.value && route.path === upgradePath) return 'upgrade'
})

function goToUpgrade() {
  router.push(upgradePath)
}

function runProfileAction(value: string) {
  const dialogRoute = headerDialogRoute(value, route)
  if (dialogRoute) router.push(dialogRoute)
  else if (value === 'upgrade') goToUpgrade()
  else if (value === 'signIn') postOffice.user.signInWithGoogle()
  else if (value === 'signOut') signOut()
  // The search entry only closes the menu for now.
}
</script>
