<template>
  <nav class="w-full">
    <ul class="flex w-full flex-col gap-1">
      <li v-for="item in items" :key="item.value">
        <CbMenuItem
          :icon-key="item.iconKey"
          :label="item.label"
          :active="modelValue === item.value"
          @click="$emit('update:modelValue', item.value)"
        />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import CbMenuItem from '../atoms/CbMenuItem.vue'

defineProps<{
  items: { value: string; iconKey: string; label: string }[]
  modelValue: string
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
