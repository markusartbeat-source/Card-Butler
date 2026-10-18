<template>
  <CbImageViewer
    v-if="openedImage"
    :key="openedImage.image.id"
    :image="openedImage.image"
    :ratio="openedImage.ratio"
    :start-rect="openedImage.tileRect"
    @close="openedImage = null"
  />

  <CbNameDialog
    v-model:open="isNewFolderDialogOpen"
    :title="dictionary.images.newFolder"
    :save="saveNewFolder"
    @closed="moveImageIntoNewFolder"
  />

  <!-- Seitlich Überstehendes wird abgeschnitten: Beim Sortieren gleiten
       Kacheln kurz von ihrem alten Platz herüber und würden sonst für einen
       Moment einen waagrechten Scrollbalken bringen. -->
  <div class="mx-auto flex max-w-315 flex-col gap-6 overflow-x-clip px-4 tablet:px-6">
    <!-- Each folder carries 8px of padding for its hover layer, so the row
         pulls back by that much and the gap of 8px adds up to the 24px
         between the folder graphics from the design. -->
    <!-- Doppelklick führt hinein, ohne dabei den Ordnernamen zu markieren. Ein
         Bild darauf gezogen landet darin, die Reihe bleibt dabei hell. -->
    <div v-if="projectFolders?.length" class="-mx-2 flex flex-wrap gap-2 select-none">
      <CbFolder
        v-for="folder in projectFolders"
        :id="folderElementId(folder.id)"
        :key="folder.id"
        :name="folder.data.name"
        v-bind="pageDropTargetAttributes(folder.id)"
        @dblclick="router.push(folderRoute(folder.id))"
      />
    </div>
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
import CbAddTile from '../components/atoms/CbAddTile.vue'
import CbFileUpload, { type FileRejectionReason } from '../components/atoms/CbFileUpload.vue'
import CbFolder from '../components/atoms/CbFolder.vue'
import { showDangerToast } from '../components/atoms/toaster'
import CbNameDialog from '../components/organisms/CbNameDialog.vue'
import CbImageGrid from '../images/CbImageGrid.vue'
import CbImageViewer from '../images/CbImageViewer.vue'
import type { ImageResource } from '../api/images/imagesApi'
import { projectImages } from '../images/projectImages'
import { isUploadingImages, uploadImages } from '../images/uploadImages'
import { useHeader } from '../components/organisms/headerState'
import { cardFormat } from '../card/cardFormat'
import { currentProject } from '../project/currentProject'
import { dimWhileDraggingClasses } from '../dragAndDrop/dimWhileDragging'
import { endDrag, releaseDrag } from '../dragAndDrop/dragState'
import { pageDropTargetAttributes } from '../dragAndDrop/pageDropTarget'
import { deleteDroppedImage } from '../images/deleteDroppedImage'
import { moveDroppedImage } from '../images/moveDroppedImage'
import { moveImage } from '../images/moveImage'
import { undoDeletionOnKey } from '../deletion/undoDeletionOnKey'
import { projectFolders } from '../folders/projectFolders'
import { createFolder } from '../folders/createFolder'
import { flyIntoFolder, folderElementId } from '../folders/flyIntoFolder'
import { folderPath } from '../folders/currentFolder'
import { showFolder } from '../folders/showFolder'

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

// Die zweite Zeile ist der Pfad von „Alle Bilder“ bis zur gezeigten Ebene.
useHeader(() => ({
  title: currentProject.value?.name,
  path: [
    { label: dictionary.header.allImages, to: folderRoute(null) },
    ...folderPath.value.map((folder) => ({ label: folder.data.name, to: folderRoute(folder.id) })),
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

// Loslassen über einem Feld der Drop-Leiste oder einem Ordner sortiert nicht –
// das Ziel entscheidet. Löschen und Hineinlegen bringen eine Animation mit und
// geben den Zieh-Zustand darum selbst frei. „In neuen Ordner“ fragt erst nach
// dem Namen, bis dahin bleibt das Bild an seinem Platz.
function finishImageDrag() {
  const { droppedOn, droppedInto, index, element } = endDrag()
  if (droppedOn === 'deleteImage') return deleteDroppedImage(index, element)
  if (droppedInto !== null) return moveDroppedImage(index, element, droppedInto)
  if (droppedOn === 'moveIntoNewFolder') askForNewFolder(index, element)
  releaseDrag()
}

const isNewFolderDialogOpen = ref(false)

// Das Bild für den neuen Ordner samt der Liste von jetzt (wird inzwischen eine
// andere geladen, wird dort nichts entfernt) und seiner Kachel, die in den
// Ordner fliegt. Die Ordner-ID kommt dazu, sobald der Ordner angelegt ist.
let imageForNewFolder: {
  image: ImageResource
  images: ImageResource[]
  tileElement: HTMLElement | null
  folderId: string | null
} | null = null

function askForNewFolder(imageIndex: number, tileElement: HTMLElement | null) {
  const images = projectImages.value
  const image = images?.[imageIndex]
  if (!images || !image) return
  imageForNewFolder = { image, images, tileElement, folderId: null }
  isNewFolderDialogOpen.value = true
}

async function saveNewFolder(name: string) {
  const folder = await createFolder(projectId, folderId, name)
  if (!folder) return false
  if (imageForNewFolder) imageForNewFolder.folderId = folder.id
  return true
}

// Erst wenn der Dialog ganz weg ist, damit der Flug zu sehen ist. Abgebrochen
// gibt es keinen Ordner, das Bild bleibt an seinem Platz.
async function moveImageIntoNewFolder() {
  const pendingMove = imageForNewFolder
  imageForNewFolder = null
  if (!pendingMove?.folderId) return
  if (pendingMove.tileElement) await flyIntoFolder(pendingMove.tileElement, pendingMove.folderId)
  await moveImage(pendingMove.image, pendingMove.folderId, pendingMove.images)
}

onMounted(() => window.addEventListener('keydown', undoDeletionOnKey))
onUnmounted(() => window.removeEventListener('keydown', undoDeletionOnKey))
</script>
