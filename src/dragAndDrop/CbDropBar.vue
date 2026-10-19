<template>
  <!-- Die Leiste fährt über den blassen Header ein, darum fest am oberen
       Fensterrand und so hoch wie der Header – damit auf Höhe der Suche. -->
  <Transition name="drop-bar">
    <div
      v-if="draggedKind"
      class="pointer-events-none fixed inset-x-0 top-0 z-10 flex h-25 items-center justify-center"
    >
      <CbToolbar
        ref="toolbar"
        :elements="fieldElements"
        :active-index="hoveredFieldIndex"
        show-names
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import CbToolbar from '../components/molecules/CbToolbar.vue'
import type { ToolbarElement } from '../components/molecules/toolbarElement'
import { draggedKind } from './dragState'
import { dropFieldsByKind, hoveredDropField, type DropField } from './dropField'
import { rememberDraggedRect } from './draggedCopyFlight'
import { hoveredPageDropTarget, pageDropTargetAt } from './pageDropTarget'
import { rememberHoveredFieldRect } from './shredding'

// Die Felder für das, was gerade gezogen wird.
const fields = computed<readonly DropField[]>(() =>
  draggedKind.value ? dropFieldsByKind[draggedKind.value] : [],
)

// So erscheint jedes Feld in der Leiste.
const fieldElementByField = computed<Record<DropField, ToolbarElement>>(() => ({
  deleteCard: { name: dictionary.dropBar.deleteCard, icon: 'delete' },
  flipAllCards: { name: dictionary.dropBar.flipAllCards, icon: 'rotate_360' },
  deleteImage: { name: dictionary.dropBar.deleteImage, icon: 'delete' },
  moveIntoNewFolder: { name: dictionary.dropBar.moveIntoNewFolder, icon: 'create_new_folder' },
  deleteFolder: { name: dictionary.dropBar.deleteFolder, icon: 'delete' },
}))

const fieldElements = computed(() => fields.value.map((field) => fieldElementByField.value[field]))

const toolbar = useTemplateRef<InstanceType<typeof CbToolbar>>('toolbar')

const hoveredFieldIndex = computed(() =>
  hoveredDropField.value === null ? null : fields.value.indexOf(hoveredDropField.value),
)

function fieldIndexCovering(rect: DOMRect) {
  return toolbar.value?.indexOverlapping(rect) ?? null
}

// Die Leiste lässt die Maus durch, dort oben kann also nichts von selbst
// reagieren. Gemessen wird stattdessen die gezogene Kopie, die die Bibliothek
// bewegt. Sie ist breiter als ein Feld, darum gewinnt das am meisten bedeckte.
// Vorher zählt das Ziel in der Seite unter dem Mauszeiger, z.B. ein Ordner oder
// ein Eintrag im Pfad neben der Leiste – wie überall, wo man etwas auf etwas
// zieht. Nur wo der Zeiger auf einem Feld steht, gilt das Feld: Ein Ziel
// darunter ist verdeckt.
function updateDropTarget(event: MouseEvent) {
  // Ohne gezogene Kopie ist die Maus schon losgelassen. Das Ziel behält dann
  // sein Leuchten, damit das Gezogene noch hineinfliegen kann.
  const draggedRect = document.querySelector('.cb-dragged')?.getBoundingClientRect()
  if (!draggedRect) return

  const isPointerOnField = fieldIndexCovering(new DOMRect(event.clientX, event.clientY, 1, 1)) !== null
  const pageDropTarget = isPointerOnField ? null : pageDropTargetAt(event.clientX, event.clientY)
  const index = pageDropTarget === null ? fieldIndexCovering(draggedRect) : null
  hoveredDropField.value = index === null ? null : (fields.value[index] ?? null)
  hoveredPageDropTarget.value = pageDropTarget

  // Das Ablegen meldet die Bibliothek erst, wenn die Kopie schon weg ist – was
  // eine Animation danach braucht, wird darum hier gemessen.
  rememberDraggedRect(draggedRect)
  rememberHoveredFieldRect(index === null ? null : (toolbar.value?.rectOfEntry(index) ?? null))
}

onMounted(() => window.addEventListener('mousemove', updateDropTarget))
onUnmounted(() => window.removeEventListener('mousemove', updateDropTarget))
</script>

<style scoped>
.drop-bar-enter-active,
.drop-bar-leave-active {
  transition: translate 350ms ease;
}

.drop-bar-enter-from,
.drop-bar-leave-to {
  translate: 0 -100%;
}
</style>
