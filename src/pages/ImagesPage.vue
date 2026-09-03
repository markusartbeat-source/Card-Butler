<template>
  <div></div>
</template>

<script setup lang="ts">
import { useHeader } from '../components/organisms/headerState'
import { showToast } from '../components/atoms/toaster'

useHeader(() => ({
  title: dictionary.images.title,
  buttons: [
    { key: 'addImages', label: dictionary.images.addImages, icon: 'add_2', variant: 'primary' },
    { key: 'more', label: dictionary.general.more, icon: 'more_horiz', variant: 'secondary' },
  ],
  onAction: () =>
    showToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText),
}))
</script>
