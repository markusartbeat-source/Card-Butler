import { searchWord } from './searchWord'

export type TextPart = { text: string; isMatch: boolean }

/** Cuts one text into the found spots and the rest around them, so a component
    can give the found spots their own look. Upper and lower case are ignored.
    Without a search word the text stays one single part. */
export function splitBySearchWord(text: string): TextPart[] {
  const word = searchWord.value.trim().toLowerCase()
  if (!word) return [{ text, isMatch: false }]

  const lowerText = text.toLowerCase()
  const parts: TextPart[] = []
  let restStart = 0

  for (;;) {
    const found = lowerText.indexOf(word, restStart)
    if (found === -1) break
    if (found > restStart) parts.push({ text: text.slice(restStart, found), isMatch: false })
    parts.push({ text: text.slice(found, found + word.length), isMatch: true })
    restStart = found + word.length
  }
  if (restStart < text.length) parts.push({ text: text.slice(restStart), isMatch: false })

  return parts
}
