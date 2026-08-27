<template>
  <!-- One price plan: name, short subtitle, price and the list of benefits. -->
  <div class="w-72 rounded-2xl bg-surface p-6 text-white">
    <h2 class="text-xl font-bold">{{ name }}</h2>
    <p class="mt-1 text-sm text-white/70">{{ subtitle }}</p>
    <p class="mt-6 text-4xl font-bold">{{ price }}€</p>

    <!-- Only the paid plans can be bought. -->
    <template v-if="price > 0">
      <CbButton class="mt-6">
        <CbIcon name="arrow_circle_up" />
        Upgrade
      </CbButton>
      <p class="mt-2 text-center text-xs text-white/70">
        Keine Verpflichtungen | Jederzeit kündbar
      </p>
    </template>

    <CbDivider class="my-6" />

    <p class="mb-4 text-sm text-white/70">{{ benefitsTitle }}</p>
    <div class="flex flex-col gap-2">
      <CbCheckLabel v-for="benefit in benefits" :key="benefit" :text="benefit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbCheckLabel from '../components/atoms/CbCheckLabel.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbIcon from '../components/atoms/CbIcon.vue'

defineProps<{
  name: string
  subtitle: string
  price: number
  benefitsTitle: string
  benefits: string[]
}>()
</script>
