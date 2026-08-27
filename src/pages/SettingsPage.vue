<template>
  <div class="flex min-h-full flex-col">
    <h1 class="p-6 text-3xl text-white">Einstellungen</h1>

    <!-- The groups stay centred on every screen width. -->
    <div class="flex flex-col items-center gap-8 pb-6">
      <CbSettingsGroup title="Account">
        <!-- The spacer pushes the button to the right edge of the row. -->
        <div class="flex items-center gap-3.5 p-6">
          <CbAvatar :name="userLabel" :image-url="userPicture" />
          <div>
            <p class="text-sm text-white">{{ userLabel }}</p>
            <p v-if="currentUser" class="text-xs text-white/50">{{ currentUser.email }}</p>
          </div>
          <div class="grow"></div>

          <CbButton
            variant="light"
            class="w-52 justify-center"
            @click="currentUser ? signOut() : signInWithGoogle()"
          >
            <CbIcon :name="currentUser ? 'door_open' : 'login'" />
            {{ currentUser ? 'Abmelden' : 'Mit Google anmelden' }}
          </CbButton>
        </div>

        <div class="flex items-center p-6 text-sm text-white">
          Sprache
          <div class="grow"></div>
          <CbSelect v-model="language" :items="languages" />
        </div>

        <div class="flex items-center p-6 text-sm text-white">
          Design
          <div class="grow"></div>
          <CbSelect v-model="theme" :items="themes" />
        </div>

        <div class="flex items-center p-6 text-sm text-white">
          Barrierefreiheit
          <div class="grow"></div>
          <CbSwitch v-model="accessibility" />
        </div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbSwitch from '../components/atoms/CbSwitch.vue'
import type { IconName } from '../components/atoms/icons'
import { signInWithGoogle, signOut, useCurrentUser } from '../composables/useCurrentUser'
import guestPicture from '../assets/profile_pictures/profile_picture_small.png'

// Signed in people see their own name and picture, everyone else a placeholder.
const { currentUser, displayName, avatarUrl } = useCurrentUser()
const userLabel = computed(() => displayName.value ?? 'Gast')
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// Picking a language only changes the field for now. Every new language is
// one more line here, with its flag registered in icons.ts.
const languages = [
  { value: 'de', label: 'Deutsch', icon: 'flag_de' },
  { value: 'en', label: 'English', icon: 'flag_gb' },
] satisfies { value: string; label: string; icon: IconName }[]
const language = ref('de')

// Picking a theme only changes the field for now, nothing switches yet.
const themes = [
  { value: 'dark', label: 'Dunkel', icon: 'dark_mode' },
  { value: 'light', label: 'Hell', icon: 'light_mode' },
] satisfies { value: string; label: string; icon: IconName }[]
const theme = ref('dark')

// The switch only flips for now, nothing changes on the page yet.
const accessibility = ref(false)
</script>
