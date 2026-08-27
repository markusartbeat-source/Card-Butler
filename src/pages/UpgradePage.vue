<template>
  <CbGoldGlow />

  <div class="relative z-10">
    <h1 class="p-6 text-3xl text-white">Pläne, die mit dir wachsen</h1>

    <!-- The plan cards sit centered in the space below the heading. -->
    <div class="mt-16 flex justify-center gap-6">
      <CbPlanCard
        v-for="plan in plans"
        :key="plan.name"
        :name="plan.name"
        :subtitle="plan.subtitle"
        :price="plan.price"
        :benefits-title="plan.benefitsTitle"
        :benefits="plan.benefits"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CbGoldGlow from '../upgrade/CbGoldGlow.vue'
import CbPlanCard from '../upgrade/CbPlanCard.vue'
import { plans } from '../upgrade/plans'
</script>
