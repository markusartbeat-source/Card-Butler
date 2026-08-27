<template>
  <!-- One price plan: name, short subtitle, price and the list of benefits.
       The thin gradient frame plus the blurred, half transparent surface
       give the card its dark glass look. -->
  <div
    class="flex w-80 rounded-2xl bg-gradient-to-b from-white/30 to-transparent p-px"
  >
    <!-- w-full inside the flex frame lets the dark surface fill the whole card. -->
    <div
      class="flex w-full flex-col rounded-2xl bg-gradient-to-b from-surface/80 to-background/80 p-6 text-white backdrop-blur-md"
    >
      <h2 class="animate-cb-rise text-xl font-bold" :style="riseDelay(0)">{{ name }}</h2>
      <p class="animate-cb-rise mt-1 text-sm text-white/70" :style="riseDelay(1)">{{ subtitle }}</p>
      <div class="animate-cb-rise mt-10 mb-4 flex items-end gap-2" :style="riseDelay(2)">
        <p class="text-4xl font-bold">{{ price }}€</p>
        <!-- Paid plans explain what the price covers. -->
        <p v-if="price > 0" class="pb-1 text-xs text-white/50">
          {{ dictionary.upgrade.priceNote }}<br />
          {{ dictionary.upgrade.billingNote }}
        </p>
      </div>

      <!-- Only the paid plans can be bought. -->
      <template v-if="price > 0">
        <CbButton class="animate-cb-rise mt-6" :style="riseDelay(3)" @click="startUpgrade">
          <CbIcon name="arrow_circle_up" />
          {{ dictionary.general.upgrade }}
        </CbButton>
        <p class="animate-cb-rise mt-2 text-center text-xs text-white/70" :style="riseDelay(4)">
          {{ dictionary.upgrade.noCommitment }}
        </p>
      </template>

      <div
        v-else
        class="animate-cb-rise mt-6 mb-5 flex items-center gap-2.5 rounded-xl bg-surface-light p-3 text-sm"
        :style="riseDelay(3)"
      >
        <!-- Free is always the plan the visitor is currently on. The extra
             bottom margin replaces the note the paid plans show here, so the
             divider sits at the same height in every card. -->
        <CbAvatar :name="userLabel" :image-url="userPicture" size="small" />
        {{ dictionary.upgrade.currentPlan }}
      </div>

      <!-- The line runs from edge to edge, so it cancels the card padding. -->
      <CbDivider class="animate-cb-rise my-6 -mx-6" :style="riseDelay(5)" />

      <p class="animate-cb-rise mb-4 text-sm text-white/70" :style="riseDelay(6)">
        {{ benefitsTitle }}
      </p>
      <div class="flex flex-col gap-2 text-white/70">
        <CbCheckLabel
          v-for="(benefit, benefitIndex) in benefits"
          :key="benefit"
          :text="benefit"
          class="animate-cb-rise"
          :style="riseDelay(7 + benefitIndex)"
        />
      </div>
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
const userLabel = computed(() => displayName.value ?? dictionary.general.guest)
const userPicture = computed(() => avatarUrl.value ?? guestPicture)

// There is no payment yet, so buying only shows a short message.
function startUpgrade() {
  showToast(dictionary.upgrade.paymentSoonTitle, dictionary.upgrade.paymentSoonText)
}

const props = defineProps<{
  name: string
  subtitle: string
  price: number
  benefitsTitle: string
  benefits: string[]
  // Position of the card in the row — later cards start a bit later.
  index: number
}>()

// Every element waits a moment longer than the one above it, so the card
// builds itself up from top to bottom instead of appearing at once.
function riseDelay(step: number) {
  return { animationDelay: `${props.index * 120 + step * 60}ms` }
}
</script>
