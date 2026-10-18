import { computed } from 'vue'
import { isDragging } from './dragState'

/** Alles, was beim Ziehen zurücktritt, trägt diese Klassen. Reines CSS – nur
    die Klasse wird gesetzt, nichts von Hand animiert. */
export const dimWhileDraggingClasses = computed(() => [
  'transition-opacity duration-300',
  isDragging.value ? 'opacity-20' : '',
])
