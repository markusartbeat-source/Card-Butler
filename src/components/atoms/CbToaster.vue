<template>
  <Toaster v-slot="toast" :toaster="toaster">
    <!-- A toast that carries export progress in its meta brings its own look
         along; every other toast is a title with an optional description. -->
    <Toast.Root
      class="cb-toast relative flex flex-col items-start rounded-lg text-white shadow-lg"
      :class="[
        backgroundClass(toast.type),
        toast.meta?.exportProgress ? 'w-84 p-5' : 'w-80 gap-1 py-4 pr-10 pl-4',
      ]"
    >
      <CbExportProgressToast
        v-if="toast.meta?.exportProgress"
        :value="toast.meta.exportProgress.value"
        :max="toast.meta.exportProgress.max"
      />

      <template v-else>
        <Toast.Title class="text-sm font-medium">{{ toast.title }}</Toast.Title>
        <Toast.Description v-if="toast.description" class="text-sm opacity-80">
          {{ toast.description }}
        </Toast.Description>
        <Toast.CloseTrigger class="absolute top-2 right-2 cursor-pointer rounded p-1 opacity-60 hover:opacity-100">
          <CbIcon name="close" />
        </Toast.CloseTrigger>
      </template>
    </Toast.Root>
  </Toaster>
</template>

<script setup lang="ts">
import { Toast, Toaster } from '@ark-ui/vue'
import CbExportProgressToast from '../../export/CbExportProgressToast.vue'
import CbIcon from './CbIcon.vue'
import { toaster } from './toaster'

function backgroundClass(type?: string) {
  if (type === 'success') return 'bg-success'
  if (type === 'error') return 'bg-danger'
  return 'bg-surface-light'
}
</script>
