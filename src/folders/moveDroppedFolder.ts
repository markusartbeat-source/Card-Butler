import { nextTick } from 'vue'
import { flyDraggedIntoPageDropTarget } from '../dragAndDrop/pageDropTarget'
import { releaseDrag } from '../dragAndDrop/dragState'
import { levelOfDropTarget } from './levelDropTarget'
import { moveFolder } from './moveFolder'
import { projectFolders } from './projectFolders'

/** Der über einer Ebene (anderer Ordner oder Eintrag im Pfad) losgelassene
    Ordner verlässt die gezeigte Ebene sofort und fliegt hinein. Das Backend
    erfährt es gleich, die Oberfläche wartet nur auf den Flug. */
export async function moveDroppedFolder(folderIndex: number, folderElement: HTMLElement | null, dropTarget: string) {
  const folders = projectFolders.value
  const folder = folders?.[folderIndex]
  if (!folders || !folder) return releaseDrag()

  // Fehler meldet moveFolder selbst und lädt die Ebene neu.
  moveFolder(folder, levelOfDropTarget(dropTarget), folders)
  // Erst wenn die Reihe die Lücke geschlossen hat, steht ein Ordner als Ziel an
  // seinem neuen Platz. Das Element lässt sich auch danach noch kopieren.
  await nextTick()
  if (folderElement) await flyDraggedIntoPageDropTarget(folderElement, dropTarget)
  releaseDrag()
}
