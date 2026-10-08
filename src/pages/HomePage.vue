<template>
  <!-- Textblock links, Abstände wie im Figma (105px links, 88px unter der Linie). -->
  <div class="mt-22 ml-26 flex w-fit flex-col gap-2.5">
    <h1 class="text-display flex flex-col leading-12.5 font-bold text-white">
      <span>{{ dictionary.home.titleCards }}</span>
      <span class="text-gold">{{ dictionary.home.titleStories }}</span>
    </h1>
    <p class="w-100 font-bold text-white">{{ dictionary.home.description }}</p>
    <!-- Vorerst ohne Funktion. -->
    <CbButton class="self-start">
      <CbIcon name="live_tv" />
      {{ dictionary.home.watchVideoTutorial }}
    </CbButton>
  </div>
</template>

<script setup lang="ts">
import CbButton from '../components/atoms/CbButton.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ logo: true, menus: false, searchbar: false, goldLine: true }))
</script>
