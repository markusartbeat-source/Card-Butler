<template>
  <div class="flex min-h-full flex-col">
    <!-- The panel stays centred on every screen width. -->
    <div class="flex flex-col items-center pb-6">
      <CbSettingsGroup :title="dictionary.shareProject.title">
        <!-- Image row -->
        <div class="p-6"></div>

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
