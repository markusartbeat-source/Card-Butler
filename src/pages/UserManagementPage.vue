<template>
  <div></div>
</template>

<script setup lang="ts">
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ title: dictionary.header.userManagement, searchbar: false }))
</script>
