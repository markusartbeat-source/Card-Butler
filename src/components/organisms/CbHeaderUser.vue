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
import CbDropdown from '../atoms/CbDropdown.vue'
import CbIcon from '../atoms/CbIcon.vue'
import CbInteractive from '../atoms/CbInteractive.vue'
import { signInWithGoogle, signOut, useCurrentUser } from '../../composables/useCurrentUser'
import guestPicture from '../../assets/profile_pictures/profile_picture_small.png'

const { currentUser, displayName, avatarUrl } = useCurrentUser()

const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// Only somebody who is signed in can sign out.
const profileMenuItems = computed(() => [
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
  settings: '/settings',
  support: '/support',
}

// The entry whose page is open right now.
const activeProfileItem = computed(() =>
  Object.keys(pageByProfileItem).find((item) => pageByProfileItem[item] === route.path),
)

function goToUpgrade() {
  router.push('/upgrade')
}

function runProfileAction(value: string) {
  const path = pageByProfileItem[value]
  if (path) router.push(path)
  else signOut()
}
</script>
