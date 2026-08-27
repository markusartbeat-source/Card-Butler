<template>
  <div class="flex min-h-full flex-col">
    <h1 class="p-6 text-3xl text-white">Einstellungen</h1>

    <!-- The groups stay centred on every screen width. -->
    <div class="flex flex-col items-center gap-8 pb-6">
      <CbSettingsGroup title="Account">
        <div class="p-6 text-sm text-white">Erste Beispielzeile</div>
        <div class="p-6 text-sm text-white">Zweite Beispielzeile</div>
      </CbSettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import CbSettingsGroup from '../components/atoms/CbSettingsGroup.vue'
</script>
