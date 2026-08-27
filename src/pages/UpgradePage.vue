<template>
  <!-- The glow lives inside the page container, so it keeps its place while
       the page transition moves the pages around. The page also brings its own
       dark background: the transition fades the page as one group, so the
       glass would otherwise lose the background it blurs and look brighter. -->
  <div class="relative flex min-h-full flex-col bg-background">
    <CbGoldGlow />

    <h1 class="relative z-10 p-6 text-3xl text-white">Pläne, die mit dir wachsen</h1>

    <!-- Two flexible spacers hold the cards in place: the space below them
         grows twice as fast, so the cards stay a bit above the middle on
         every screen height. -->
    <div class="grow"></div>

    <div class="relative z-10 flex justify-center gap-6">
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

    <div class="grow-2"></div>
  </div>
</template>

<script setup lang="ts">
import CbGoldGlow from '../upgrade/CbGoldGlow.vue'
import CbPlanCard from '../upgrade/CbPlanCard.vue'
import { plans } from '../upgrade/plans'
</script>
