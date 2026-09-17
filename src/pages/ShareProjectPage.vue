<template>
  <!-- The spacers share the free height 2:3, so the panel stands a little
       above the middle of a tall screen — optically centred. On a short screen
       they shrink to nothing and the page scrolls as usual. -->
  <div class="flex min-h-full flex-col">
    <div class="grow-2"></div>
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.shareProject.title">
        <!-- Image row: the width comes from the panel, the height follows.
             Decorative only, so the alt text stays empty. -->
        <div class="animate-cb-rise border-b-0 px-6 pt-6" :style="riseDelay(0)">
          <img
            src="../assets/visuals/Add Friends.png"
            alt=""
            class="share-image w-full rounded-2xl object-cover"
          />
        </div>

        <!-- Link row -->
        <div class="flex flex-col gap-3 p-6">
          <h3 class="animate-cb-rise text-sm text-white" :style="riseDelay(1)">
            {{ dictionary.shareProject.linkHeading }}
          </h3>
          <div class="animate-cb-rise flex items-center gap-3" :style="riseDelay(2)">
            <CbInput v-model="shareLink" :label="dictionary.shareProject.linkHeading" class="grow" />
            <CbButton class="w-24" @click="copyShareLink">
              {{ dictionary.shareProject.copy }}
            </CbButton>
          </div>
          <CbSelect
            v-model="linkPermission"
            variant="field"
            :label="dictionary.shareProject.permission"
            :items="permissions"
            class="animate-cb-rise"
            :style="riseDelay(3)"
          />
          <CbInput
            v-model="linkPassword"
            :label="dictionary.shareProject.password"
            class="animate-cb-rise"
            :style="riseDelay(4)"
          />
        </div>

        <!-- Mail row -->
        <div class="flex flex-col gap-3 p-6">
          <h3 class="animate-cb-rise text-sm text-white" :style="riseDelay(5)">
            {{ dictionary.shareProject.mailHeading }}
          </h3>
          <div class="animate-cb-rise flex items-center gap-3" :style="riseDelay(6)">
            <CbInput
              v-model="inviteMail"
              :label="dictionary.shareProject.invite"
              :placeholder="dictionary.shareProject.mailPlaceholder"
              class="grow"
            />
            <CbButton class="w-24" @click="sendInvite">{{ dictionary.shareProject.invite }}</CbButton>
          </div>
          <CbSelect
            v-model="invitePermission"
            variant="field"
            :label="dictionary.shareProject.permission"
            :items="permissions"
            class="animate-cb-rise"
            :style="riseDelay(7)"
          />
        </div>
      </CbSettingsGroup>
    </div>
    <div class="grow-3"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbInput from '../components/atoms/CbInput.vue'
import CbSelect from '../components/atoms/CbSelect.vue'
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import { useHeader } from '../components/organisms/headerState'
import { showSuccessToast } from '../components/atoms/toaster'

useHeader(() => ({ title: dictionary.header.shareProject, searchbar: false }))

// A made-up link until the project has a real one to share.
const shareLink = ref('https://abc.de')

// What a person opening the link may do. Only page state for now.
const permissions = computed(() => [
  { value: 'view', label: dictionary.shareProject.permissionView },
  { value: 'edit', label: dictionary.shareProject.permissionEdit },
  { value: 'admin', label: dictionary.shareProject.permissionAdmin },
])
const linkPermission = ref('view')
const linkPassword = ref('')

async function copyShareLink() {
  await navigator.clipboard.writeText(shareLink.value)
  showSuccessToast(dictionary.project.linkCopiedTitle, dictionary.project.linkCopiedText)
}

// The person to invite by mail and what they may do.
const inviteMail = ref('')
const invitePermission = ref('view')

// No backend yet: only tells the user the invitation went out.
function sendInvite() {
  showSuccessToast(dictionary.shareProject.inviteSent(inviteMail.value))
}

// Every row waits a moment longer than the one above it, so the panel builds
// itself up from top to bottom — the same feel as the settings page.
function riseDelay(step: number) {
  return { animationDelay: `${step * 60}ms` }
}
</script>

<style scoped>
/* A little taller than the design's 582 × 125, so the photo gets more room. */
.share-image {
  aspect-ratio: 582 / 160;
}
</style>
