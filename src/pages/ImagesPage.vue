<template>
  <CbHeader title="Bilder" :buttons="headerButtons" @action="showToast($event, 'Diese Funktion gibt es noch nicht.')" />
</template>

<script setup lang="ts">
import CbHeader from '../components/organisms/CbHeader.vue'
import type { HeaderButton } from '../components/organisms/headerButton'
import { showToast } from '../components/atoms/toaster'

const headerButtons: HeaderButton[] = [
  { key: 'Bilder hinzufügen', label: 'Bilder hinzufügen', icon: 'add_2', variant: 'primary' },
  { key: 'Mehr', label: 'Mehr', icon: 'more_horiz', variant: 'secondary' },
]
</script>
