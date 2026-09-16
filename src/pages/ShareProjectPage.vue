<template>
  <div class="flex min-h-full flex-col">
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.shareProject.title">
        <!-- Image row: a dark box in the photo's shape until the real image
             arrives. The width comes from the panel, the height follows. -->
        <div class="border-b-0 px-6 pt-6">
          <div class="share-image-placeholder w-full rounded-2xl bg-background"></div>
        </div>

        <!-- Link row -->
        <div class="p-6"></div>

        <!-- Mail row -->
        <div class="p-6"></div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.header.shareProject, searchbar: false }))
</script>

<style scoped>
/* The photo's shape from the design (582 × 125). */
.share-image-placeholder {
  aspect-ratio: 582 / 125;
}
</style>
