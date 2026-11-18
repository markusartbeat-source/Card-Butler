<template>
  <!-- Der Name des Sets, daneben das Drei-Punkte-Menü. Der Knopf zeigt sich,
       solange die Maus über der ganzen Zeile ist, er den Tastatur-Fokus hat oder
       seine Liste offen ist (aria-expanded) – auf Touch-Geräten ohne Hover immer.
       contain-inline-size: Die Zeile macht den Block um die Karten nicht breiter,
       ein langer Name bricht um (siehe ProjectPage). -->
  <div class="group flex items-center gap-2 contain-inline-size">
    <!-- Doppelklick benennt um, wie der Menüeintrag (der ist auch per Tastatur
         erreichbar). select-none: Der Doppelklick markiert sonst das Wort. -->
    <h2 class="cb-headline-01 select-none" @dblclick="isRenameDialogOpen = true">
      {{ cardSet.data.name }}
    </h2>
    <CbDropdown :items="menuItems" @select="runMenuAction">
      <CbButton
        variant="icon"
        :aria-label="dictionary.cardSets.menuLabel(cardSet.data.name)"
        class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100 pointer-coarse:opacity-100"
      >
        <CbIcon name="more_horiz" />
      </CbButton>
    </CbDropdown>

    <!-- Hängt sich selbst an den body, nimmt in der Zeile keinen Platz. -->
    <CbNameDialog
      v-model:open="isRenameDialogOpen"
      :title="dictionary.cardSets.renameCardSet"
      :initial-name="cardSet.data.name"
      :save="(name) => renameCardSet(cardSet, name)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CbButton from '../components/atoms/CbButton.vue'
import CbDropdown, { type DropdownItem } from '../components/atoms/CbDropdown.vue'
import CbIcon from '../components/atoms/CbIcon.vue'
import CbNameDialog from '../components/organisms/CbNameDialog.vue'
import { flipAllCards } from '../cardDrag/flipAllCards'
import { deleteWithUndo } from '../deletion/deleteWithUndo'
import { currentProject } from '../project/currentProject'
import { cardSetIdToShow, cardSets, type CardSet } from './cardSets'
import { renameCardSet } from './changeCardSet'
import { createCardSet } from './createCardSet'
import { deleteCardSet } from './deleteCardSet'

const props = defineProps<{ cardSet: CardSet }>()

// „Alle Karten umdrehen“ dreht wie das Feld der Drop-Leiste alle Sets um.
const menuItems = computed(() => {
  const items: DropdownItem[] = [
    { value: 'renameCardSet', label: dictionary.cardSets.renameCardSet, icon: 'edit' },
    { value: 'addCardSet', label: dictionary.cardSets.addCardSet, icon: 'add_2' },
    { value: 'flipAllCards', label: dictionary.dropBar.flipAllCards, icon: 'rotate_360' },
  ]
  // Löschen steht abgesetzt und rot. Das letzte Set lässt sich nicht löschen:
  // Ohne Set hätte die Seite keinen Knopf für neue Karten.
  if ((cardSets.value?.length ?? 0) > 1) {
    items.push('separator', {
      value: 'deleteCardSet',
      label: dictionary.cardSets.deleteCardSet,
      icon: 'delete',
      danger: true,
    })
  }
  return items
})

const isRenameDialogOpen = ref(false)

const menuActions: Record<string, () => unknown> = {
  flipAllCards,
  addCardSet,
  renameCardSet: () => (isRenameDialogOpen.value = true),
  deleteCardSet: () =>
    cardSets.value &&
    deleteWithUndo(cardSets.value, props.cardSet, dictionary.cardSets.cardSetDeleted, deleteCardSet),
}

function runMenuAction(value: string) {
  menuActions[value]?.()
}

// Das neue Set kommt ans Ende – eine Reihenfolge der Sets kennt das Backend
// nicht. Die Seite gleitet dorthin.
async function addCardSet() {
  if (!currentProject.value) return
  const newCardSet = await createCardSet(currentProject.value.id)
  if (newCardSet) cardSetIdToShow.value = newCardSet.id
}
</script>
