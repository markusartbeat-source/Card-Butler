<template>
  <div class="flex -space-x-2">
    <CbAvatar
      v-for="person in people"
      :key="person.name"
      :name="person.name"
      :image-url="person.imageUrl"
      size="small"
      class="ring-surface ring-2"
    />
  </div>
</template>

<script setup lang="ts">
import CbAvatar from '../atoms/CbAvatar.vue'

defineProps<{ people: { name: string; imageUrl?: string }[] }>()
</script>
