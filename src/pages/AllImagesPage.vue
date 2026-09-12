<template>
  <div></div>
</template>

<script setup lang="ts">
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.header.allImages, searchbar: false }))
</script>
