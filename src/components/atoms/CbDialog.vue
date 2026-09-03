<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The panel is one flat dark surface with a 1px frame that fades out
       towards the bottom — both taken from the Figma design (fill #202036 =
       background, stroke #2c2f45 = surface, fading to transparent). -->
  <!-- Without this, an opening dialog puts the focus on its close button, which
       the browser then rings as if it had been reached with the Tab key. The
       panel itself takes the focus instead — a screen reader reads the title
       that way, and the Tab key still walks through the dialog from the top. -->
  <Dialog.Root
    :open="open"
    :initial-focus-el="() => panel"
    @update:open="$emit('update:open', $event)"
  >
    <Teleport to="body">
      <Dialog.Backdrop class="cb-fade fixed inset-0 z-50 bg-background/80 backdrop-blur-md" />

      <Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <Dialog.Content
          class="cb-dialog flex w-172 max-w-full rounded-3xl bg-gradient-to-b from-surface to-transparent p-px shadow-lg"
        >
          <!-- w-full inside the flex frame lets the dark surface fill the panel.
               tabindex -1 only lets the panel be focused by the dialog itself,
               never by the Tab key, so it needs no ring of its own. -->
          <div
            ref="panel"
            tabindex="-1"
            class="flex w-full flex-col gap-12 rounded-3xl bg-background p-6 text-white focus:outline-none"
          >
            <div class="flex items-center justify-between">
              <Dialog.Title class="text-xl">{{ title }}</Dialog.Title>

              <Dialog.CloseTrigger as-child>
                <CbButton variant="ghost" :aria-label="dictionary.general.close">
                  <CbIcon name="close" />
                </CbButton>
              </Dialog.CloseTrigger>
            </div>

            <slot />

            <!-- The row only exists when the dialog really brings buttons,
                 otherwise it would leave an empty gap at the bottom. -->
            <div v-if="$slots.buttons" class="flex justify-end gap-4">
              <slot name="buttons" />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Dialog } from '@ark-ui/vue'
import CbButton from './CbButton.vue'
import CbIcon from './CbIcon.vue'

const panel = useTemplateRef<HTMLElement>('panel')

defineProps<{ open: boolean; title: string }>()
defineEmits<{ 'update:open': [open: boolean] }>()
</script>
