<template>
  <!-- One price plan: name, short subtitle, price and the list of benefits.
       The thin gradient frame plus the blurred, half transparent surface
       give the card its dark glass look. -->
  <div
    class="flex w-80 rounded-2xl bg-gradient-to-b from-highlight/30 to-transparent p-px ring ring-surface-edge"
  >
    <!-- w-full inside the flex frame lets the dark surface fill the whole card. -->
    <div
      class="flex w-full flex-col rounded-2xl bg-gradient-to-b from-surface/80 to-background/80 p-6 backdrop-blur-md"
    >
      <h2 class="cb-headline-01 animate-cb-rise" :style="riseDelay(0)">{{ name }}</h2>
      <p class="cb-regular-text-muted animate-cb-rise mt-1" :style="riseDelay(1)">{{ subtitle }}</p>
      <div class="animate-cb-rise mt-10 mb-4 flex items-end gap-2" :style="riseDelay(2)">
        <p class="cb-display-text">{{ price }}€</p>
        <!-- Paid plans explain what the price covers. -->
        <p v-if="price > 0" class="cb-small-text-muted pb-1">
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
        <p class="cb-small-text-muted animate-cb-rise mt-2 text-center" :style="riseDelay(4)">
          {{ dictionary.upgrade.noCommitment }}
        </p>
      </template>

      <div
        v-else
        class="cb-regular-text animate-cb-rise mt-6 mb-5 flex items-center gap-2.5 rounded-xl bg-surface-light p-3"
        :style="riseDelay(3)"
      >
        <!-- Free is always the plan the visitor is currently on. The extra
             bottom margin replaces the note the paid plans show here, so the
             divider sits at the same height in every card. -->
        <CbAvatar :name="userLabel" :image-url="userPicture" />
        {{ dictionary.upgrade.currentPlan }}
      </div>

      <!-- The line runs from edge to edge, so it cancels the card padding. -->
      <CbDivider class="animate-cb-rise my-6 -mx-6" :style="riseDelay(5)" />

      <p class="cb-regular-text-muted animate-cb-rise mb-4" :style="riseDelay(6)">
        {{ benefitsTitle }}
      </p>
      <div class="cb-regular-text-muted flex flex-col gap-2">
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
