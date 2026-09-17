<template>
  <div>
    <CbFolder :name="dictionary.project.name" />
  </div>
</template>

<script setup lang="ts">
import CbFolder from '../components/atoms/CbFolder.vue'
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.header.allImages, searchbar: false }))
</script>
