<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here. -->
  <Tabs.Root
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <!-- The indicator is placed against this list, so it needs to be the
         positioned parent. -->
    <!-- The tabs share the full width, so their hover areas touch each other
         and fill the whole row. -->
    <Tabs.List class="relative flex">
      <Tabs.Trigger
        v-for="item in items"
        :key="item.value"
        v-ripple
        :value="item.value"
        class="cb-hover relative flex-1 overflow-hidden px-3 py-2 text-center text-base font-bold text-white"
      >
        {{ item.label }}
      </Tabs.Trigger>

      <!-- Ark sets position and left inline, the width comes as a variable. -->
      <Tabs.Indicator class="bottom-0 h-0.5 w-(--width) bg-gold" />
    </Tabs.List>

    <Tabs.Content v-for="item in items" :key="item.value" :value="item.value">
      <slot :name="item.value" />
    </Tabs.Content>
  </Tabs.Root>
</template>

<script setup lang="ts">
import { Tabs } from '@ark-ui/vue'

defineProps<{
  items: { value: string; label: string }[]
  modelValue: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
