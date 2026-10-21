<template>
  <!-- Welches Bild das Element auf dieser einen Karte zeigt. Ein Ordner öffnet
       sich in der offenen Liste, ihr erster Eintrag führt dann wieder hinaus.
       Ordner und Bilder lädt erst das erste Öffnen. -->
  <CbSelect
    variant="pictures"
    hide-label
    :label="dictionary.cardEditor.chosenPicture"
    :placeholder="dictionary.cardEditor.noPictureChosen"
    :items="items"
    :model-value="imageId"
    :selected-item="selectedItem"
    @update:model-value="select"
    @update:open="(isOpen) => isOpen && showTopLevelOnce()"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CbSelect from '../../components/atoms/CbSelect.vue'
import type { Card } from '../../cardSets/cardSets'
import { folderPictures } from '../../folders/folderPictures'
import { knownImages } from '../../images/knownImages'
import { chooseCardPicture } from './chooseCardPicture'
import { usePictureLevel } from './usePictureLevel'

const props = defineProps<{ elementId: string; card: Card }>()

const { path, folders, images, showTopLevelOnce, openFolder, leaveFolder } = usePictureLevel()

// Wert des Eintrags „zurück“ – Ordner und Bilder haben UUIDs, die nie so heißen.
const leaveFolderValue = 'leaveFolder'

const items = computed(() => {
  const currentFolder = path.value.at(-1)
  const leaveFolderItems = currentFolder
    ? [
        {
          value: leaveFolderValue,
          label: currentFolder.data.name,
          ariaLabel: dictionary.cardEditor.leaveFolder(currentFolder.data.name),
          icon: 'chevron_left' as const,
          keepsListOpen: true,
        },
      ]
    : []
  return [
    ...leaveFolderItems,
    ...folders.value.map((folder) => ({
      value: folder.id,
      label: folder.data.name,
      // Wählen öffnet den Ordner, statt ein Bild zu nehmen – das hört man auch.
      ariaLabel: dictionary.cardEditor.openFolder(folder.data.name),
      picture: folderPictures.value[folder.id],
      isFolder: true,
      keepsListOpen: true,
    })),
    ...images.value.map((image) => ({
      value: image.id,
      label: image.data.name,
      picture: image.data.location,
    })),
  ]
})

const imageId = computed(() => props.card.elementImageIds[props.elementId])

// Das gewählte Bild liegt oft in einem anderen Ordner als dem gezeigten.
const selectedItem = computed(() => {
  const image = imageId.value && knownImages.value[imageId.value]
  return image ? { value: imageId.value, label: image.name, picture: image.location } : undefined
})

function select(value: string) {
  if (value === leaveFolderValue) return leaveFolder()
  const folder = folders.value.find((folder) => folder.id === value)
  if (folder) return openFolder(folder)
  chooseCardPicture(props.card, props.elementId, value)
}
</script>
