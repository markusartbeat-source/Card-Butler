<template>
  <CbGoldGlow />

  <div class="relative z-10">
    <h1 class="p-6 text-3xl text-white">Pläne, die mit dir wachsen</h1>

    <!-- Temporary preview of the new atoms, removed again in a later step. -->
    <CbDivider class="mx-6" />
    <div class="mx-6 mt-4 flex flex-col gap-2">
      <CbCheckLabel text="10 MB Speicher" />
      <CbCheckLabel text="Exportieren als PNGs" />
      <CbCheckLabel text="1 Projekt" />
    </div>

    <!-- The plan cards sit centered in the space below the heading. -->
    <div class="mt-16 flex justify-center gap-8"></div>
  </div>
</template>

<script setup lang="ts">
import CbCheckLabel from '../components/atoms/CbCheckLabel.vue'
import CbDivider from '../components/atoms/CbDivider.vue'
import CbGoldGlow from '../upgrade/CbGoldGlow.vue'
</script>
