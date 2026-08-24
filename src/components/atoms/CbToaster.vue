<template>
  <Toaster v-slot="toast" :toaster="toaster">
    <Toast.Root
      class="cb-toast relative flex w-80 flex-col items-start gap-1 rounded-lg py-4 pr-10 pl-4 text-white shadow-lg"
      :class="backgroundClass(toast.type)"
    >
      <Toast.Title class="text-sm font-medium">{{ toast.title }}</Toast.Title>
      <Toast.Description v-if="toast.description" class="text-sm opacity-80">
        {{ toast.description }}
      </Toast.Description>
      <Toast.CloseTrigger class="absolute top-2 right-2 cursor-pointer rounded p-1 opacity-60 hover:opacity-100">
        <CbIcon name="close" />
      </Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>
</template>

<script setup lang="ts">
import { Toast, Toaster } from '@ark-ui/vue'
import CbIcon from './CbIcon.vue'
import { toaster } from './toaster'

function backgroundClass(type?: string) {
  if (type === 'success') return 'bg-success'
  if (type === 'error') return 'bg-danger'
  return 'bg-surface-light'
}
</script>
