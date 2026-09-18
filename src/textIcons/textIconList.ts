import { ref } from 'vue'
import goldImage from '../assets/icons/gold.png'
import crystalImage from '../assets/icons/crystal.png'
import shieldImage from '../assets/icons/shield.png'

export type TextIcon = { id: number; name: string; image: string }

// The icons that can be placed inside the text. Dummy data in memory for now;
// later this belongs to the text element of the card set.
export const textIcons = ref<TextIcon[]>([
  { id: 1, name: 'Gold', image: goldImage },
  { id: 2, name: 'Kristall', image: crystalImage },
  { id: 3, name: 'Schild', image: shieldImage },
])
