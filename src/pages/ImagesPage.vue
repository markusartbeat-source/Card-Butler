<template>
  <CbHeader
    :title="dictionary.images.title"
    :buttons="headerButtons"
    @action="showToast(dictionary.general.notAvailableTitle, dictionary.general.notAvailableText)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbHeader from '../components/organisms/CbHeader.vue'
import type { HeaderButton } from '../components/organisms/headerButton'
import { showToast } from '../components/atoms/toaster'

const headerButtons = computed<HeaderButton[]>(() => [
  {
    key: 'addImages',
    label: dictionary.images.addImages,
    icon: 'add_2',
    variant: 'primary',
  },
  { key: 'more', label: dictionary.general.more, icon: 'more_horiz', variant: 'secondary' },
])
</script>
