<template>
  <div></div>
</template>

<script setup lang="ts">
import { useHeader } from '../components/organisms/headerState'

useHeader(() => ({ logo: true, menus: false, searchbar: false, goldLine: true }))
</script>
