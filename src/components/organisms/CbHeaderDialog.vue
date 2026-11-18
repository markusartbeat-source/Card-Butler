<template>
  <!-- Der Dialog, den die Adresse öffnet (headerDialogs.ts), über der Seite.
       Schließen geht über die Adresse, so wirken Kreuz, Escape und „Zurück“ im
       Browser gleich. -->
  <CbDialog
    :open="!!openDialog"
    :title="shownDialog?.label ?? ''"
    :size-class="shownDialog?.value === 'all-images' ? 'h-full tablet:w-330' : 'tablet:h-auto tablet:w-172'"
    panel-class="gap-6"
    fills-phone-screen
    @update:open="closeHeaderDialog(router)"
    @closed="forgetClosedDialog"
  >
    <!-- Nur der Inhalt scrollt, der Titel bleibt stehen. 2px Luft, damit der
         Scrollbereich Ringe am Rand nicht abschneidet. -->
    <div v-if="shownDialog" class="-m-0.5 min-h-0 flex-1 overflow-y-auto p-0.5">
      <component :is="contentByDialog[shownDialog.value]" :key="shownDialog.fullPath" />
    </div>
  </CbDialog>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CbDialog from '../atoms/CbDialog.vue'
import CbAllImages from '../../images/CbAllImages.vue'
import CbIconsInText from '../../textIcons/CbIconsInText.vue'
import CbShareProject from '../../shareProject/CbShareProject.vue'
import CbUserManagement from '../../userManagement/CbUserManagement.vue'
import CbSettings from '../../settings/CbSettings.vue'
import CbSupport from '../../support/CbSupport.vue'
import { closeHeaderDialog, headerDialogAt, type HeaderDialog } from './headerDialogs'

const route = useRoute()
const router = useRouter()

const contentByDialog: Record<string, Component> = {
  'all-images': CbAllImages,
  'icons-in-text': CbIconsInText,
  'share-project': CbShareProject,
  'user-management': CbUserManagement,
  settings: CbSettings,
  support: CbSupport,
}

const openDialog = computed(() => headerDialogAt(route))

// Der gezeigte Dialog samt Adresse. Beim Schließen bleibt er stehen, bis er
// ausgeblendet ist – sonst wechselte sein Inhalt mitten im Ausblenden. Eine
// neue Adresse (z.B. ein anderer Bilder-Ordner) hängt den Inhalt neu ein.
const shownDialog = ref<(HeaderDialog & { fullPath: string }) | null>(null)

watchEffect(() => {
  if (openDialog.value) shownDialog.value = { ...openDialog.value, fullPath: route.fullPath }
})

// Ging inzwischen schon wieder einer auf, bleibt der stehen.
function forgetClosedDialog() {
  if (!openDialog.value) shownDialog.value = null
}
</script>
