import type { CardElementValues } from '../cardElements/cardValues'
import { searchWord } from './searchWord'

/** Does one card contain the search word in any of its text contents? Upper and
    lower case are ignored. With an empty search word every card matches, so the
    overview shows all cards again. */
export function cardMatchesSearch(values: CardElementValues) {
  const word = searchWord.value.trim().toLowerCase()
  if (!word) return true

  return Object.values(values).some(({ text }) => text?.toLowerCase().includes(word))
}
