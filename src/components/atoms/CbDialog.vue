<template>
  <!-- Ark UI brings the behaviour only, the whole look comes from here.
       The panel is one flat dark surface with a 1px frame that fades out
       towards the bottom — both taken from the Figma design (fill #202036 =
       background, stroke #2c2f45 = surface, fading to transparent). -->
  <!-- Without this, an opening dialog puts the focus on its close button, which
       the browser then rings as if it had been reached with the Tab key. The
       panel itself takes the focus instead — a screen reader reads the title
       that way, and the Tab key still walks through the dialog from the top. -->
  <!-- Toasts bleiben bedienbar (z.B. „Rückgängig“), ein Klick darauf schließt
       den Dialog nicht. -->
  <Dialog.Root
    :open="open"
    :initial-focus-el="initialFocusElement"
    :persistent-elements="[toastGroupElement]"
    @update:open="$emit('update:open', $event)"
    @exit-complete="$emit('closed')"
  >
    <Teleport to="body">
      <Dialog.Backdrop class="cb-fade fixed inset-0 z-50 bg-backdrop backdrop-blur-md" />

      <!-- Mit fillsPhoneScreen füllt der Dialog auf dem Handy den ganzen
           Bildschirm, ohne Rand und ohne runde Ecken. -->
      <!-- Ist der Dialog niedriger als der Bildschirm, liegt 1/3 des freien
           Platzes über ihm und 2/3 darunter (flex-1 zu flex-2). -->
      <Dialog.Positioner
        class="fixed inset-0 z-50 flex flex-col items-center"
        :class="fillsPhoneScreen ? 'tablet:p-6' : 'p-6'"
      >
        <div class="flex-1" />
        <!-- How wide and how tall the dialog is comes from the outside, only
             never bigger than the screen. -->
        <Dialog.Content
          class="cb-dialog flex max-h-full max-w-full bg-gradient-to-b from-surface to-transparent p-px shadow-lg ring ring-surface-edge"
          :class="[sizeClass, cornerClass, { 'size-full': fillsPhoneScreen }]"
        >
          <!-- w-full inside the flex frame lets the dark surface fill the panel.
               tabindex -1 only lets the panel be focused by the dialog itself,
               never by the Tab key, so it needs no ring of its own. -->
          <div
            ref="panel"
            tabindex="-1"
            class="flex w-full flex-col bg-background text-foreground focus:outline-none"
            :class="cornerClass"
          >
            <!-- Titelzeile in surface, damit sie sich vom Inhalt abhebt. Der
                 Rand unten ist nur in den Kontrastmodi sichtbar. Kein
                 overflow-hidden am Panel für die Ecken, das könnte Listen im
                 Inhalt abschneiden – die Zeile rundet sich selbst. -->
            <div
              class="flex items-center justify-between border-b border-surface-edge bg-surface px-6 py-4"
              :class="topCornerClass"
            >
              <!-- Anything that belongs in front of the title, like the arrow
                   back to the previous step of a dialog with several steps. -->
              <div class="flex items-center gap-2">
                <slot name="titleStart" />

                <Dialog.Title class="cb-headline-01">{{ title }}</Dialog.Title>
              </div>

              <Dialog.CloseTrigger as-child>
                <CbButton variant="icon" :aria-label="dictionary.general.close">
                  <CbIcon name="close" />
                </CbButton>
              </Dialog.CloseTrigger>
            </div>

            <!-- Inhalt und Fußzeile. min-h-0, damit ein Inhalt, der selbst
                 scrollt, kleiner werden darf als er ist. -->
            <div class="flex min-h-0 flex-1 flex-col p-6" :class="panelClass">
              <slot />

              <!-- The footer only exists when the dialog really brings one,
                   otherwise it would leave an empty gap at the bottom. -->
              <footer v-if="$slots.footer" class="flex justify-end gap-4">
                <slot name="footer" />
              </footer>
            </div>
          </div>
        </Dialog.Content>

        <div class="flex-2" />
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue'
import { Dialog } from '@ark-ui/vue'
import CbButton from './CbButton.vue'
import CbIcon from './CbIcon.vue'
import { toastGroupElement } from './toaster'

const panel = useTemplateRef<HTMLElement>('panel')

// Ausnahme zum Fokus auf dem Panel (siehe oben): Ein Feld mit autofocus, z.B.
// ein Namensfeld, bekommt ihn direkt, damit man sofort tippen kann.
function initialFocusElement() {
  return panel.value?.querySelector<HTMLElement>('[autofocus]') ?? panel.value
}

// sizeClass is how wide and tall the dialog is, panelClass der Abstand zwischen
// Inhalt und Fußzeile. Both come from whoever opens the
// dialog — the dialog itself has no size of its own.
const props = defineProps<{
  open: boolean
  title: string
  sizeClass?: string
  panelClass?: string
  fillsPhoneScreen?: boolean
}>()

const cornerClass = computed(() => (props.fillsPhoneScreen ? 'tablet:rounded-3xl' : 'rounded-3xl'))
const topCornerClass = computed(() => (props.fillsPhoneScreen ? 'tablet:rounded-t-3xl' : 'rounded-t-3xl'))
defineEmits<{
  'update:open': [open: boolean]
  /** Ganz zu, auch das Ausblenden ist vorbei. */
  closed: []
}>()

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
