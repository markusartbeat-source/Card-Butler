<template>
  <!-- One price plan: name, short subtitle, price and the list of benefits. -->
  <div class="w-72 rounded-2xl bg-surface p-6 text-white">
    <h2 class="text-xl font-bold">{{ name }}</h2>
    <p class="mt-1 text-sm text-white/70">{{ subtitle }}</p>
    <p class="mt-6 text-4xl font-bold">{{ price }}€</p>

    <!-- Only the paid plans can be bought. -->
    <template v-if="price > 0">
      <CbButton class="mt-6" @click="startUpgrade">
        <CbIcon name="arrow_circle_up" />
        Upgrade
      </CbButton>
      <p class="mt-2 text-center text-xs text-white/70">
        Keine Verpflichtungen | Jederzeit kündbar
      </p>
    </template>

    <div v-else class="mt-6 flex items-center gap-2.5 rounded-xl bg-surface-light p-3 text-sm">
      <!-- Free is always the plan the visitor is currently on. -->
      <CbAvatar :name="userLabel" :image-url="userPicture" size="small" />
      Dein aktueller Plan
    </div>

    <CbDivider class="my-6" />

    <p class="mb-4 text-sm text-white/70">{{ benefitsTitle }}</p>
    <div class="flex flex-col gap-2">
      <CbCheckLabel v-for="benefit in benefits" :key="benefit" :text="benefit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbAvatar from '../components/atoms/CbAvatar.vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbCheckLabel from '../components/atoms/CbCheckLabel.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import { showToast } from '../components/atoms/toaster'
import { useCurrentUser } from '../composables/useCurrentUser'
import guestPicture from '../assets/profile_pictures/profile_picture_small.png'

// Signed in people see their own avatar, everyone else the guest picture.
const { displayName, avatarUrl } = useCurrentUser()
const userLabel = computed(() => displayName.value ?? 'Gast')
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// There is no payment yet, so buying only shows a short message.
function startUpgrade() {
  showToast('Bezahlung kommt bald', 'Das Upgrade lässt sich noch nicht kaufen.')
}

defineProps<{
  name: string
  subtitle: string
  price: number
  benefitsTitle: string
  benefits: string[]
}>()
</script>
