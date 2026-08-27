<template>
  <!-- One price plan: name, short subtitle, price and the list of benefits. -->
  <div class="w-72 rounded-2xl bg-surface p-6 text-white">
    <h2 class="text-xl font-bold">{{ name }}</h2>
    <p class="mt-1 text-sm text-white/70">{{ subtitle }}</p>
    <p class="mt-6 text-4xl font-bold">{{ price }}€</p>

    <CbDivider class="my-6" />

    <p class="mb-4 text-sm text-white/70">{{ benefitsTitle }}</p>
    <div class="flex flex-col gap-2">
      <CbCheckLabel v-for="benefit in benefits" :key="benefit" :text="benefit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CbCheckLabel from '../components/atoms/CbCheckLabel.vue'
import CbDivider from '../components/atoms/CbDivider.vue'

defineProps<{
  name: string
  subtitle: string
  price: number
  benefitsTitle: string
  benefits: string[]
}>()
</script>
