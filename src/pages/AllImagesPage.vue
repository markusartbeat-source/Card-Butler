<template>
  <CbImageViewer v-if="openedImage" :image="openedImage" @close="openedImage = null" />

  <div class="mx-auto max-w-315 px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <div class="-mx-2 flex gap-2">
      <CbFolder v-for="folder in folders" :key="folder" :name="dictionary.project.name" />
    </div>
    <CbImageGrid class="mt-6" :images="dummyImages" @open="openedImage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CbFolder from '../components/atoms/CbFolder.vue'
import CbImageGrid from '../images/CbImageGrid.vue'
import CbImageViewer from '../images/CbImageViewer.vue'
import { dummyImages, type DummyImage } from '../images/dummyImages'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.header.allImages, searchbar: false }))

const folders = [1, 2, 3]

const openedImage = ref<DummyImage | null>(null)
</script>
