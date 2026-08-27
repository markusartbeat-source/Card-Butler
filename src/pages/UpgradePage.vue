<template>
  <CbGoldGlow />

  <div class="relative z-10">
    <h1 class="p-6 text-3xl text-white">Pläne, die mit dir wachsen</h1>

    <!-- The plan cards sit centered in the space below the heading. -->
    <div class="mt-16 flex justify-center gap-8">
      <CbPlanCard
        name="Free"
        subtitle="Einfach mal ausprobieren"
        :price="0"
        benefits-title="Deine Vorteile:"
        :benefits="['10 MB Speicher', 'Exportieren als PNGs', '1 Projekt']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CbGoldGlow from '../upgrade/CbGoldGlow.vue'
import CbPlanCard from '../upgrade/CbPlanCard.vue'
</script>
