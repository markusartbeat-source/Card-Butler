<template>
  <div v-if="people.length" class="flex -space-x-4">
    <CbAvatar
      v-for="person in visiblePeople"
      :key="person.id"
      :name="person.name"
      :image-url="person.imageUrl"
      :color="person.color"
      size="small"
      class="ring-surface ring-2"
    />
    <div
      v-if="hiddenCount > 0"
      class="bg-surface-light ring-surface flex size-7 shrink-0 items-center justify-center rounded-full text-xs text-white ring-2"
    >
      +{{ hiddenCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbAvatar from '../atoms/CbAvatar.vue'

const maxVisibleAvatars = 3

const props = defineProps<{
  people: { id: string; name: string; imageUrl?: string; color?: string }[]
}>()

const visiblePeople = computed(() => props.people.slice(0, maxVisibleAvatars))
const hiddenCount = computed(() => props.people.length - visiblePeople.value.length)
</script>
