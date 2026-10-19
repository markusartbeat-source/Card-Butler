<template>
  <CbViewer
    v-if="openedImage"
    :key="openedImage.image.id"
    :label="openedImage.image.data.name"
    :ratio="openedImage.ratio"
    :start-rect="openedImage.tileRect"
    @close="openedImage = null"
  >
    <!-- Zugeschnitten wie im Raster, falls dort das Seitenverhältnis noch
         nicht bekannt war (1:1). -->
    <img
      :src="openedImage.image.data.location"
      :alt="openedImage.image.data.name"
      class="size-full rounded-lg object-cover"
    />
    <template #panel>
      <CbImageSettingsPanel
        class="h-full"
        @move-into-new-folder="moveOpenedImageIntoNewFolder"
        @delete-image="deleteOpenedImage"
      />
    </template>
  </CbViewer>

  <CbViewer
    v-if="openedFolder"
    :key="openedFolder.folder.id"
    :label="openedFolder.folder.data.name"
    :ratio="folderGraphicRatio"
    :start-rect="openedFolder.graphicRect"
    @close="openedFolder = null"
  >
    <CbFolder :name="openedFolder.folder.data.name" graphic-only />
    <template #panel>
      <CbFolderSettingsPanel
        class="h-full"
        @open-folder="enterOpenedFolder"
        @move-into-new-folder="moveOpenedFolderIntoNewFolder"
        @delete-folder="deleteOpenedFolder"
      />
    </template>
  </CbViewer>

  <CbNameDialog
    v-model:open="isNewFolderDialogOpen"
    :title="dictionary.images.newFolder"
    :save="saveNewFolder"
    @closed="moveItemIntoNewFolder"
  />

  <!-- Seitlich Überstehendes wird abgeschnitten: Beim Sortieren gleiten
       Kacheln kurz von ihrem alten Platz herüber und würden sonst für einen
       Moment einen waagrechten Scrollbalken bringen. -->
  <div class="mx-auto flex max-w-315 flex-col gap-6 overflow-x-clip px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <!-- Ein Klick zeigt den Ordner im Betrachter, ein Doppelklick führt hinein,
         ohne dabei den Ordnernamen zu markieren und ohne dass Doppeltippen auf
         dem Handy die Seite vergrößert. Ein Bild darauf gezogen landet darin,
         die Reihe bleibt dabei hell. Der geöffnete Ordner bleibt an seinem
         Platz, nur unsichtbar – von dort fliegt er hoch und zurück. -->
    <!-- Ziehen über die Ränder der anderen Ordner sortiert um, nur lokal: Das
         Backend kennt keine Reihenfolge. Über der Mitte eines Ordners landet der
         gezogene darin. Die Bibliothek bewegt die Kiste per „transform“,
         gekippt wird der Ordner darin (siehe style.css). Per Tastatur sortiert
         Alt+←/→. -->
    <VueDraggable
      v-if="projectFolders?.length"
      v-model="projectFolders"
      v-bind="edgeSortingDragOptions"
      draggable=".cb-folder-tile"
      class="-mx-2 flex touch-manipulation flex-wrap gap-2 select-none"
      @start="startDrag('folder', $event)"
      @end="finishFolderDrag"
    >
      <div v-for="folder in projectFolders" :key="folder.id" class="cb-folder-tile">
        <CbFolder
          :id="folderElementId(folder.id)"
          :name="folder.data.name"
          class="cb-folder-face cursor-grab active:cursor-grabbing"
          :class="{ invisible: folder.id === openedFolder?.folder.id }"
          v-bind="pageDropTargetAttributes(levelDropTarget(folder.id))"
          :aria-keyshortcuts="sortingKeyShortcuts"
          @click="(event, graphicRect) => clickFolder(folder, event, graphicRect)"
          @keydown="sortWithAltArrow($event, projectFolders ?? [], folder)"
        />
      </div>
    </VueDraggable>
    <CbImageGrid
      :images="projectImages ?? []"
      @update:images="projectImages = $event"
      :opened-image-id="openedImage?.image.id"
      @open="openImage"
      @drag-end="finishImageDrag"
    >
      <!-- Hochkant wie eine Karte, wächst mit der Zeile wie die Bilder. -->
      <template #leading="{ tileStyle }">
        <!-- Während des Hochladens gesperrt. Das Ergebnis meldet danach ein
             Toast, den Screenreader vorlesen. Kein Kommentar vor CbAddTile:
             Ark legt sich per as-child darauf. -->
        <CbFileUpload
          :accept="acceptedImageTypes"
          :max-file-size="maximumImageMegabytes * 1024 * 1024"
          :disabled="isUploadingImages"
          @accept="uploadImages(projectId, folderId, $event)"
          @reject="showRejectedImage"
        >
          <CbAddTile
            icon="add_2"
            :label="isUploadingImages ? dictionary.images.uploadingImages : dictionary.images.uploadImages"
            :aria-busy="isUploadingImages"
            class="rounded-lg data-disabled:cursor-progress"
            :class="dimWhileDraggingClasses"
            :style="tileStyle(cardFormat.width / cardFormat.height)"
          />
        </CbFileUpload>
      </template>
    </CbImageGrid>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import CbAddTile from '../components/atoms/CbAddTile.vue'
import CbFileUpload, { type FileRejectionReason } from '../components/atoms/CbFileUpload.vue'
import CbFolder, { folderGraphicRatio } from '../components/atoms/CbFolder.vue'
import { showDangerToast } from '../components/atoms/toaster'
import CbNameDialog from '../components/organisms/CbNameDialog.vue'
import CbViewer from '../components/organisms/CbViewer.vue'
import CbImageGrid from '../images/CbImageGrid.vue'
import CbImageSettingsPanel from '../images/CbImageSettingsPanel.vue'
import CbFolderSettingsPanel from '../folders/CbFolderSettingsPanel.vue'
import type { ImageResource } from '../api/images/imagesApi'
import type { FolderResource } from '../api/folders/foldersApi'
import { projectImages } from '../images/projectImages'
import { isUploadingImages, uploadImages } from '../images/uploadImages'
import { useHeader } from '../components/organisms/headerState'
import { cardFormat } from '../card/cardFormat'
import { currentProject } from '../project/currentProject'
import { dimWhileDraggingClasses } from '../dragAndDrop/dimWhileDragging'
import { edgeSortingDragOptions } from '../dragAndDrop/dragOptions'
import { endDrag, isDragging, releaseDrag, startDrag } from '../dragAndDrop/dragState'
import { pageDropTargetAttributes } from '../dragAndDrop/pageDropTarget'
import { deleteDroppedItem } from '../dragAndDrop/deleteDroppedItem'
import { deleteWithUndo } from '../deletion/deleteWithUndo'
import { deleteImage } from '../images/deleteImage'
import { moveDroppedImage } from '../images/moveDroppedImage'
import { moveImage } from '../images/moveImage'
import { deleteFolder } from '../folders/deleteFolder'
import { moveDroppedFolder } from '../folders/moveDroppedFolder'
import { moveFolder } from '../folders/moveFolder'
import { undoDeletionOnKey } from '../deletion/undoDeletionOnKey'
import { sortingKeyShortcuts, sortWithAltArrow } from '../keyboard/sortWithAltArrow'
import { projectFolders } from '../folders/projectFolders'
import { createFolder } from '../folders/createFolder'
import { flyIntoFolder, folderElementId } from '../folders/flyIntoFolder'
import { folderPath } from '../folders/currentFolder'
import { showFolder } from '../folders/showFolder'
import { levelDropTarget } from '../folders/levelDropTarget'

// Die Seite wird je Projekt und je Ordner neu eingehängt (App.vue schlüsselt
// nach der Adresse), die IDs bleiben also fest. Ohne Ordner die oberste Ebene.
const route = useRoute()
const router = useRouter()
const projectId = String(route.params.projectId)
const folderId = route.params.folderId ? String(route.params.folderId) : null

// Adresse einer Ebene dieser Seite, null = oberste.
function folderRoute(targetFolderId: string | null) {
  return { name: 'all-images', params: { projectId, folderId: targetFolderId } }
}

// Die zweite Zeile ist der Pfad von „Alle Bilder“ bis zur gezeigten Ebene. Auf
// jeden Eintrag lässt sich ein Bild ziehen, es landet in dessen Ebene.
function pathEntry(label: string, targetFolderId: string | null) {
  return { label, to: folderRoute(targetFolderId), dropTarget: levelDropTarget(targetFolderId) }
}

useHeader(() => ({
  title: currentProject.value?.name,
  path: [
    pathEntry(dictionary.header.allImages, null),
    ...folderPath.value.map((folder) => pathEntry(folder.data.name, folder.id)),
  ],
  searchbar: false,
}))

// Bei jedem Öffnen der Seite frisch, so erscheinen auch Bilder und Ordner der
// anderen im Projekt. Einen unbekannten Ordner meldet schon die Poststelle,
// dann geht es auf die oberste Ebene – "replace", damit „Zurück“ nicht wieder
// hierher führt.
showFolder(projectId, folderId).then((isFolderFound) => {
  if (!isFolderFound) router.replace(folderRoute(null))
})

// Was das Backend an Bildern annimmt (10 MB wie in Spring: 10 · 1024 · 1024 Byte).
const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/gif']
const maximumImageMegabytes = 10

function showRejectedImage(file: File, reason: FileRejectionReason) {
  showDangerToast(
    dictionary.images.imageRejected(file.name),
    reason === 'wrongType'
      ? dictionary.images.wrongImageType
      : dictionary.images.imageTooLarge(maximumImageMegabytes),
  )
}

// Das geöffnete Bild samt Seitenverhältnis und dem Platz seiner Kachel im
// Raster, dort startet der Flug des Betrachters.
const openedImage = ref<{ image: ImageResource; tileRect: DOMRect; ratio: number } | null>(null)

function openImage(image: ImageResource, tileRect: DOMRect, ratio: number) {
  openedImage.value = { image, tileRect, ratio }
}

// Der geöffnete Ordner samt dem Platz seiner Grafik in der Reihe, dort startet
// der Flug des Betrachters.
const openedFolder = ref<{ folder: FolderResource; graphicRect: DOMRect } | null>(null)

// Ein Klick wartet kurz, ob ein zweiter auf denselben Ordner folgt – dann geht
// es hinein, sonst öffnet der Betrachter. Selbst gezählt statt per dblclick,
// damit auch Doppeltippen auf dem Handy ankommt. Per Tastatur (Enter,
// Leertaste) zählt der Browser keine Klicks (detail 0), dann öffnet er sofort.
// Der Klick nach einem beendeten Ziehen zählt nicht, und wer nach einem Klick
// gleich zieht, bekommt keinen Betrachter.
const doubleClickWindowInMilliseconds = 250
let pendingFolderClick: { folderId: string; timer: ReturnType<typeof setTimeout> } | null = null

function clickFolder(folder: FolderResource, event: MouseEvent, graphicRect: DOMRect) {
  if (isDragging.value) return
  const isSecondClick = pendingFolderClick?.folderId === folder.id
  clearTimeout(pendingFolderClick?.timer)
  pendingFolderClick = null

  const openFolderViewer = () => (openedFolder.value = { folder, graphicRect })
  if (event.detail === 0) return openFolderViewer()
  if (isSecondClick) return router.push(folderRoute(folder.id))

  const timer = setTimeout(() => {
    pendingFolderClick = null
    if (!isDragging.value) openFolderViewer()
  }, doubleClickWindowInMilliseconds)
  pendingFolderClick = { folderId: folder.id, timer }
}

// Der Betrachter verschwindet sofort, sonst stünde er beim Seitenwechsel noch
// über der neuen Ebene.
function enterOpenedFolder() {
  const folder = openedFolder.value?.folder
  if (!folder) return
  openedFolder.value = null
  router.push(folderRoute(folder.id))
}

// Die übrigen Knöpfe im Betrachter tun dasselbe wie die Felder der Drop-Leiste,
// nur ohne Schredder. Auch hier verschwindet der Betrachter sofort: Was er
// zeigt, verlässt gleich die Reihe bzw. fliegt nach dem Benennen von seiner
// Kachel in den neuen Ordner.
function moveOpenedImageIntoNewFolder() {
  const image = openedImage.value?.image
  openedImage.value = null
  if (!image) return
  const images = projectImages.value
  askForNewFolder(images, images?.indexOf(image) ?? -1, document.getElementById(image.id), moveImage)
}

function deleteOpenedImage() {
  const image = openedImage.value?.image
  openedImage.value = null
  if (image && projectImages.value) {
    deleteWithUndo(projectImages.value, image, dictionary.dropBar.imageDeleted, deleteImage)
  }
}

function moveOpenedFolderIntoNewFolder() {
  const folder = openedFolder.value?.folder
  openedFolder.value = null
  if (!folder) return
  const folders = projectFolders.value
  const tileElement = document.getElementById(folderElementId(folder.id))
  askForNewFolder(folders, folders?.indexOf(folder) ?? -1, tileElement, moveFolder)
}

function deleteOpenedFolder() {
  const folder = openedFolder.value?.folder
  openedFolder.value = null
  if (folder && projectFolders.value) {
    deleteWithUndo(projectFolders.value, folder, dictionary.dropBar.folderDeleted, deleteFolder)
  }
}

// Losgelassen über einem Feld der Drop-Leiste, einem Ordner oder einem Eintrag
// im Pfad entscheidet das Ziel. Löschen und Hineinlegen bringen eine Animation
// mit und geben den Zieh-Zustand darum selbst frei. „In neuen Ordner“ fragt
// erst nach dem Namen, bis dahin bleibt das Bild an seinem Platz.
function finishImageDrag(event: { newDraggableIndex?: number }) {
  const { droppedOn, droppedInto, index, element } = endDrag(event)
  if (droppedOn === 'deleteImage') {
    return deleteDroppedItem(projectImages.value ?? [], index, element, dictionary.dropBar.imageDeleted, deleteImage)
  }
  if (droppedInto !== null) return moveDroppedImage(index, element, droppedInto)
  if (droppedOn === 'moveIntoNewFolder') askForNewFolder(projectImages.value, index, element, moveImage)
  releaseDrag()
}

// Wie beim Bild: Ein Ordner oder ein Eintrag im Pfad nimmt den Ordner auf,
// Löschen nimmt seinen Inhalt mit, „In neuen Ordner“ fragt erst nach dem Namen.
function finishFolderDrag(event: { newDraggableIndex?: number }) {
  const { droppedOn, droppedInto, index, element } = endDrag(event)
  if (droppedOn === 'deleteFolder') {
    return deleteDroppedItem(projectFolders.value ?? [], index, element, dictionary.dropBar.folderDeleted, deleteFolder)
  }
  if (droppedInto !== null) return moveDroppedFolder(index, element, droppedInto)
  if (droppedOn === 'moveIntoNewFolder') askForNewFolder(projectFolders.value, index, element, moveFolder)
  releaseDrag()
}

const isNewFolderDialogOpen = ref(false)

// Was in den neuen Ordner soll (Bild oder Ordner), festgelegt samt der Liste von
// jetzt (wird inzwischen eine andere geladen, wird dort nichts entfernt), und
// seine Kachel, die in den Ordner fliegt. Die Ordner-ID kommt dazu, sobald der
// Ordner angelegt ist.
let itemForNewFolder: {
  moveInto: (newFolderId: string) => unknown
  tileElement: HTMLElement | null
  folderId: string | null
} | null = null

function askForNewFolder<Item>(
  items: Item[] | null,
  index: number,
  tileElement: HTMLElement | null,
  move: (item: Item, newFolderId: string, items: Item[]) => unknown,
) {
  const item = items?.[index]
  if (!items || !item) return
  itemForNewFolder = { moveInto: (newFolderId) => move(item, newFolderId, items), tileElement, folderId: null }
  isNewFolderDialogOpen.value = true
}

async function saveNewFolder(name: string) {
  const folder = await createFolder(projectId, folderId, name)
  if (!folder) return false
  if (itemForNewFolder) itemForNewFolder.folderId = folder.id
  return true
}

// Erst wenn der Dialog ganz weg ist, damit der Flug zu sehen ist. Abgebrochen
// gibt es keinen Ordner, Bild bzw. Ordner bleibt an seinem Platz.
async function moveItemIntoNewFolder() {
  const pendingMove = itemForNewFolder
  itemForNewFolder = null
  if (!pendingMove?.folderId) return
  if (pendingMove.tileElement) await flyIntoFolder(pendingMove.tileElement, pendingMove.folderId)
  await pendingMove.moveInto(pendingMove.folderId)
}

onMounted(() => window.addEventListener('keydown', undoDeletionOnKey))
onUnmounted(() => window.removeEventListener('keydown', undoDeletionOnKey))
</script>
