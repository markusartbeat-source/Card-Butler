<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here. -->
  <Toc.Root :items="tocItems" :active-ids="modelValue ? [modelValue] : []">
    <Toc.Title class="cb-headline-02 px-3">{{ title }}</Toc.Title>

    <!-- Ark measures the active entry against this list, so it has to be the
         positioned parent of the indicator. -->
    <Toc.List class="relative mt-6 flex flex-col">
      <Toc.Item v-for="item in items" :key="item.value" :item="{ value: item.value, depth: 1 }">
        <!-- Later every entry is a real heading in the page and Ark follows the
             scrolling on its own. Until then the click says what is active.
             Der aktive Eintrag steht in Gold. -->
        <Toc.Link
          :href="`#${item.value}`"
          class="cb-regular-text data-active:cb-regular-text-gold block px-3 py-2.5"
          @click.prevent="$emit('update:modelValue', item.value)"
        >
          {{ item.label }}
        </Toc.Link>
      </Toc.Item>

      <!-- Ark hands the place of the active entry over as variables. -->
      <Toc.Indicator class="top-(--top) left-0 h-(--height) w-0.5 bg-gold" />
    </Toc.List>
  </Toc.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Toc } from '@ark-ui/vue'

const props = defineProps<{
  title: string
  items: { value: string; label: string }[]
  /** null: kein Eintrag ist markiert. */
  modelValue: string | null
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

// Ark wants every entry with its heading level. The list is flat for now.
const tocItems = computed(() => props.items.map((item) => ({ value: item.value, depth: 1 })))
</script>
