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

        <div class="p-6 text-sm text-white">Zweite Beispielzeile</div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import { signInWithGoogle, signOut, useCurrentUser } from '../composables/useCurrentUser'
import guestPicture from '../assets/profile_pictures/profile_picture_small.png'

// Signed in people see their own name and picture, everyone else a placeholder.
const { currentUser, displayName, avatarUrl } = useCurrentUser()
const userLabel = computed(() => displayName.value ?? 'Gast')
const userPicture = computed(() => avatarUrl.value ?? guestPicture)
</script>
