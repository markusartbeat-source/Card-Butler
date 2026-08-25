<template>
  <div class="flex -space-x-2">
    <CbAvatar
      v-for="person in visiblePeople"
      :key="person.name"
      :name="person.name"
      :image-url="person.imageUrl"
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

const props = defineProps<{ people: { name: string; imageUrl?: string }[] }>()

const visiblePeople = computed(() => props.people.slice(0, maxVisibleAvatars))
const hiddenCount = computed(() => props.people.length - visiblePeople.value.length)
</script>
