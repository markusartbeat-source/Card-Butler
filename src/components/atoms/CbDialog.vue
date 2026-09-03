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
        <!-- How wide and how tall the dialog is comes from the outside, only
             never bigger than the screen. -->
        <Dialog.Content
          class="cb-dialog flex max-h-full max-w-full rounded-3xl bg-gradient-to-b from-surface to-transparent p-px shadow-lg"
          :class="sizeClass"
        >
          <!-- w-full inside the flex frame lets the dark surface fill the panel.
               tabindex -1 only lets the panel be focused by the dialog itself,
               never by the Tab key, so it needs no ring of its own. -->
          <div
            ref="panel"
            tabindex="-1"
            class="flex w-full flex-col rounded-3xl bg-background p-6 text-white focus:outline-none"
            :class="panelClass"
          >
            <div class="flex items-center justify-between">
              <!-- Anything that belongs in front of the title, like the arrow
                   back to the previous step of a dialog with several steps. -->
              <div class="flex items-center gap-2">
                <slot name="titleStart" />

                <Dialog.Title class="text-xl">{{ title }}</Dialog.Title>
              </div>

              <Dialog.CloseTrigger as-child>
                <CbButton variant="ghost" :aria-label="dictionary.general.close">
                  <CbIcon name="close" />
                </CbButton>
              </Dialog.CloseTrigger>
            </div>

            <slot />

            <!-- The footer only exists when the dialog really brings one,
                 otherwise it would leave an empty gap at the bottom. -->
            <footer v-if="$slots.footer" class="flex justify-end gap-4">
              <slot name="footer" />
            </footer>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue'
import { Dialog } from '@ark-ui/vue'
import CbButton from './CbButton.vue'
import CbIcon from './CbIcon.vue'

const panel = useTemplateRef<HTMLElement>('panel')

// sizeClass is how wide and tall the dialog is, panelClass the space between
// its title, its content and its footer. Both come from whoever opens the
// dialog — the dialog itself has no size of its own.
const props = defineProps<{
  open: boolean
  title: string
  sizeClass?: string
  panelClass?: string
}>()
defineEmits<{ 'update:open': [open: boolean] }>()

// The box around the panel is the one that carries the size and the corners.
// Whoever opens the dialog can measure it, for example to fly it somewhere.
const boxElement = computed(() => panel.value?.closest<HTMLElement>('.cb-dialog') ?? null)
defineExpose({ boxElement })

// A dialog without a height of its own is exactly as tall as its content, and
// that content is swapped in the very same moment the size changes. The
// browser therefore measures the new, mostly empty content and the dialog
// collapses before it grows. So the size it has right now is written onto the
// box first — without any animation, otherwise that step would be animated
// too — and given back once the new content is in. From there the dialog
// grows out of the size the eye last saw.
watch(
  () => props.sizeClass,
  () => {
    // The box around the panel is the one that carries the size.
    const element = panel.value?.closest<HTMLElement>('.cb-dialog')
    if (!element) return

    element.style.transition = 'none'
    element.style.width = `${element.offsetWidth}px`
    element.style.height = `${element.offsetHeight}px`

    nextTick(() => {
      // Reading a measure makes the browser take over the held size right
      // away, then everything is handed back and the new size animates in.
      void element.offsetHeight
      element.style.transition = ''
      element.style.width = ''
      element.style.height = ''
    })
  },
)
</script>
