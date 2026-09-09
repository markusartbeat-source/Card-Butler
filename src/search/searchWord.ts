import { ref } from 'vue'

/** What the user typed into the header search pill. Shared by everyone who
    reacts to the search: the card overview, the card text elements. */
export const searchWord = ref('')

export function clearSearchWord() {
  searchWord.value = ''
}
