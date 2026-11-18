<template>
  <div class="flex flex-col gap-8">
    <CbSettingsGroup :title="dictionary.settings.accountGroup" same-row-height>
      <!-- The spacer pushes the button to the right edge of the row. -->
      <div class="animate-cb-rise flex items-center gap-3.5 p-6" :style="riseDelay(0)">
        <CbAvatar :name="userLabel" :image-url="userPicture" />
        <p class="cb-regular-text">{{ userLabel }}</p>
        <div class="grow"></div>

        <CbButton
          variant="light"
          class="w-52 justify-center"
          @click="currentUser ? signOut() : postOffice.user.signInWithGoogle()"
        >
          <CbIcon :name="currentUser ? 'door_open' : 'login'" />
          {{ currentUser ? dictionary.general.signOut : dictionary.general.signInWithGoogle }}
        </CbButton>
      </div>

      <div class="cb-regular-text animate-cb-rise flex items-center p-6" :style="riseDelay(1)">
        {{ dictionary.settings.language }}
        <div class="grow"></div>
        <CbSelect v-model="language" :items="languages" />
      </div>

      <div class="cb-regular-text animate-cb-rise flex items-center p-6" :style="riseDelay(2)">
        {{ dictionary.settings.theme }}
        <div class="grow"></div>
        <CbSelect
          v-model="themeName"
          :items="themes"
          :label="dictionary.settings.theme"
          hide-label
          :class="notStoredClass"
        />
      </div>

      <div class="cb-regular-text animate-cb-rise flex items-center p-6" :style="riseDelay(3)">
        {{ dictionary.settings.highContrast }}
        <div class="grow"></div>
        <CbSwitch
          v-model="isHighContrast"
          :label="dictionary.settings.highContrast"
          :class="notStoredClass"
        />
      </div>
    </CbSettingsGroup>

    <CbSettingsGroup :title="dictionary.settings.subscriptionGroup" same-row-height>
      <div class="cb-regular-text animate-cb-rise flex items-center p-6" :style="riseDelay(4)">
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
          <p class="cb-regular-text">{{ dictionary.settings.storage }}</p>
          <p class="cb-small-text-muted">
            {{ subscription.storageUsedMb }} MB {{ dictionary.settings.storageOf }}
            {{ subscription.storageTotalMb }} MB {{ dictionary.settings.storageUsed }}
          </p>
        </div>
        <div class="grow"></div>
        <CbProgress :value="subscription.storageUsedMb" :max="subscription.storageTotalMb" class="w-52" />
      </div>

      <div class="animate-cb-rise flex items-center p-6" :style="riseDelay(6)">
        <div>
          <p class="cb-regular-text">{{ dictionary.settings.freeProjects }}</p>
          <p class="cb-small-text-muted">
            {{ subscription.projectsUsed }} {{ dictionary.settings.storageOf }}
            {{ subscription.projectsTotal }} {{ dictionary.settings.storageUsed }}
          </p>
        </div>
        <div class="grow"></div>
        <CbProgress :value="subscription.projectsUsed" :max="subscription.projectsTotal" class="w-52" />
      </div>

      <div
        class="cb-regular-text animate-cb-rise flex items-center px-6 py-3"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbProgress from '../components/atoms/CbProgress.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import CbStreetview from '../components/atoms/CbStreetview.vue'
import CbSwitch from '../components/atoms/CbSwitch.vue'
import { showToast } from '../components/atoms/toaster'
import type { IconName } from '../components/atoms/icons'
import { postOffice } from '../api/postOffice/postOffice'
import { signOut, useCurrentUser } from '../composables/useCurrentUser'
import { subscription } from './subscription'
import { notStoredClass } from '../notStored/notStoredMark'
import { isHighContrast, theme, type ThemeChoice } from '../theme/theme'
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

// Wie das Gerät, hell oder dunkel, dazu der Schalter für hohen Kontrast (folgt
// ebenfalls dem Gerät, bis man ihn umlegt). Beides schaltet sofort um
// (theme/theme.ts) und gilt vorerst nur in diesem Browser – darum rot markiert.
const themes = computed<{ value: ThemeChoice; label: string; icon: IconName }[]>(() => [
  { value: 'device', label: dictionary.settings.themeDevice, icon: 'brightness_auto' },
  { value: 'dark', label: dictionary.settings.themeDark, icon: 'dark_mode' },
  { value: 'light', label: dictionary.settings.themeLight, icon: 'light_mode' },
])
const themeName = computed<string>({
  get: () => theme.value,
  set: (value) => (theme.value = value as ThemeChoice),
})

// Every row waits a moment longer than the one above it, so the settings build
// themselves up from top to bottom — the same feel as the plan cards.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>
