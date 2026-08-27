<template>
  <div class="flex min-h-full flex-col">
    <CbHeader :title="dictionary.settings.title" :searchbar="false" />

    <!-- The groups stay centred on every screen width. -->
    <div class="flex flex-col items-center gap-8 pb-6">
      <CbSettingsGroup :title="dictionary.settings.accountGroup">
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
            {{ currentUser ? dictionary.general.signOut : dictionary.general.signInWithGoogle }}
          </CbButton>
        </div>

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(1)">
          {{ dictionary.settings.language }}
          <div class="grow"></div>
          <CbSelect v-model="language" :items="languages" />
        </div>

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(2)">
          {{ dictionary.settings.theme }}
          <div class="grow"></div>
          <CbSelect v-model="theme" :items="themes" />
        </div>

        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(3)">
          {{ dictionary.settings.accessibility }}
          <div class="grow"></div>
          <CbSwitch v-model="accessibility" />
        </div>
      </CbSettingsGroup>

      <CbSettingsGroup :title="dictionary.settings.subscriptionGroup">
        <div class="animate-cb-rise flex items-center p-6 text-sm text-white" :style="riseDelay(4)">
          {{ subscription.planName }}, {{ subscription.pricePerMonth }}€
          {{ dictionary.settings.perMonth }}
          <div class="grow"></div>

          <CbButton class="w-52" @click="router.push('/upgrade')">
            <CbIcon name="arrow_circle_up" />
            {{ dictionary.general.upgrade }}
          </CbButton>
        </div>

        <div class="animate-cb-rise flex items-center p-6" :style="riseDelay(5)">
          <div>
            <p class="text-sm text-white">{{ dictionary.settings.storage }}</p>
            <p class="text-xs text-white/50">
              {{ subscription.storageUsedMb }} MB {{ dictionary.settings.storageOf }}
              {{ subscription.storageTotalMb }} MB {{ dictionary.settings.storageUsed }}
            </p>
          </div>
          <div class="grow"></div>
          <CbProgress :value="subscription.storageUsedMb" :max="subscription.storageTotalMb" />
        </div>

        <div class="animate-cb-rise flex items-center p-6" :style="riseDelay(6)">
          <div>
            <p class="text-sm text-white">{{ dictionary.settings.freeProjects }}</p>
            <p class="text-xs text-white/50">
              {{ subscription.projectsUsed }} {{ dictionary.settings.storageOf }}
              {{ subscription.projectsTotal }} {{ dictionary.settings.storageUsed }}
            </p>
          </div>
          <div class="grow"></div>
          <CbProgress :value="subscription.projectsUsed" :max="subscription.projectsTotal" />
        </div>

        <div
          class="animate-cb-rise flex items-center px-6 py-3 text-sm text-white"
          :style="riseDelay(7)"
        >
          {{ dictionary.settings.dataLocation }}
          <div class="grow"></div>
          <CbStreetview
            :city-name="subscription.dataCityName"
            :latitude="subscription.dataLatitude"
            :longitude="subscription.dataLongitude"
            @click="
              showToast(
                dictionary.settings.dataLocationSoonTitle,
                dictionary.settings.dataLocationSoonText,
              )
            "
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
const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// Picking a language switches every text of the app at once. Every new
// language is one more line here, with its flag registered in icons.ts.
const languages = computed<{ value: string; label: string; icon: IconName }[]>(() => [
  { value: 'de', label: dictionary.settings.languageGerman, icon: 'flag_de' },
  { value: 'en', label: dictionary.settings.languageEnglish, icon: 'flag_gb' },
  { value: 'es', label: dictionary.settings.languageSpanish, icon: 'flag_es' },
  { value: 'fr', label: dictionary.settings.languageFrench, icon: 'flag_fr' },
  { value: 'pt', label: dictionary.settings.languagePortuguese, icon: 'flag_br' },
])

// The field shows the language in use and hands a new pick straight to the
// dictionary, so there is no second place that could fall out of step.
const language = computed<string>({
  get: () => currentLanguage.value,
  set: (value) => setLanguage(value as LanguageCode),
})

// Picking a theme only changes the field for now, nothing switches yet.
const themes = computed<{ value: string; label: string; icon: IconName }[]>(() => [
  { value: 'dark', label: dictionary.settings.themeDark, icon: 'dark_mode' },
  { value: 'light', label: dictionary.settings.themeLight, icon: 'light_mode' },
])
const theme = ref('dark')

// The switch only flips for now, nothing changes on the page yet.
const accessibility = ref(false)

// Every row waits a moment longer than the one above it, so the page builds
// itself up from top to bottom — the same feel as the plan cards.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>
