<template>
  <div class="flex min-h-full flex-col">
    <CbHeader title="Einstellungen" :searchbar="false" />

    <!-- The groups stay centred on every screen width. -->
    <div class="flex flex-col items-center gap-8 pb-6">
      <CbSettingsGroup title="Account">
        <!-- The spacer pushes the button to the right edge of the row. -->
        <div class="animate-cb-rise flex items-center gap-3.5 p-6" :style="riseDelay(0)">
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

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(1)">
          Sprache
          <div class="grow"></div>
          <CbSelect v-model="language" :items="languages" />
        </div>

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(2)">
          Design
          <div class="grow"></div>
          <CbSelect v-model="theme" :items="themes" />
        </div>

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(3)">
          Barrierefreiheit
          <div class="grow"></div>
          <CbSwitch v-model="accessibility" />
        </div>
      </CbSettingsGroup>

      <CbSettingsGroup title="Subscription">
        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(4)">
          {{ subscription.planName }}, {{ subscription.pricePerMonth }}€ monatlich
          <div class="grow"></div>

          <CbButton class="w-52" @click="router.push('/upgrade')">
            <CbIcon name="arrow_circle_up" />
            Upgrade
          </CbButton>
        </div>

        <div class="animate-cb-rise flex items-center p-6" :style="riseDelay(5)">
          <div>
            <p class="text-sm text-white">Speicherplatz</p>
            <p class="text-xs text-white/50">
              {{ subscription.storageUsedMb }} MB von {{ subscription.storageTotalMb }} MB belegt
            </p>
          </div>
          <div class="grow"></div>
          <CbProgress :value="subscription.storageUsedMb" :max="subscription.storageTotalMb" />
        </div>

        <div class="animate-cb-rise flex items-center p-6" :style="riseDelay(6)">
          <div>
            <p class="text-sm text-white">Freie Projekte</p>
            <p class="text-xs text-white/50">
              {{ subscription.projectsUsed }} von {{ subscription.projectsTotal }} belegt
            </p>
          </div>
          <div class="grow"></div>
          <CbProgress :value="subscription.projectsUsed" :max="subscription.projectsTotal" />
        </div>

        <div
          class="animate-cb-rise flex items-center px-6 py-3 text-sm text-white"
          :style="riseDelay(7)"
        >
          Ort deiner Daten
          <div class="grow"></div>
          <CbStreetview
            :city-name="subscription.dataCityName"
            :latitude="subscription.dataLatitude"
            :longitude="subscription.dataLongitude"
            @click="showToast('Kommt bald', 'Hier kannst du später den Ort deiner Daten wählen.')"
          />
        </div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProgress from '../components/atoms/CbProgress.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbStreetview from '../components/atoms/CbStreetview.vue'
import CbSwitch from '../components/atoms/CbSwitch.vue'
import CbHeader from '../components/organisms/CbHeader.vue'
import { showToast } from '../components/atoms/toaster'
import type { IconName } from '../components/atoms/icons'
import { signInWithGoogle, signOut, useCurrentUser } from '../composables/useCurrentUser'
import { subscription } from '../settings/subscription'
import guestPicture from '../assets/profile_pictures/profile_picture_small.png'

const router = useRouter()

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

// Every row waits a moment longer than the one above it, so the page builds
// itself up from top to bottom — the same feel as the plan cards.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>
