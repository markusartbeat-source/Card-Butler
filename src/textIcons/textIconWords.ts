import { textIcons, type TextIcon } from './textIconList'

// An icon is placed by typing its name as a word of its own: "Gold" or
// "gold" becomes the coin, "Golden" stays text. Only letters count as
// neighbours, so "+4Gold" still works.
// An icon without a name (just uploaded) cannot be typed yet. With no names
// at all the pattern matches nothing, instead of the empty string everywhere.
function iconWordPattern() {
  const names = textIcons.value
    .filter((icon) => icon.name.trim() !== '')
    .map((icon) => icon.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (names.length === 0) return /(?!)/g
  return new RegExp(`(?<!\\p{L})(${names.join('|')})(?!\\p{L})`, 'giu')
}

function iconNameById(id: string | undefined) {
  return textIcons.value.find((icon) => String(icon.id) === id)?.name ?? ''
}

function findIconByName(name: string) {
  return textIcons.value.find((icon) => icon.name.trim().toLowerCase() === name.toLowerCase())
}

// Aussehen jedes Icon-Bilds im Text – für das Tippfeld und die Karten gleich.
// Size, lift and side spacing come from the CSS variables the text carries
// (see textIconSettings.ts). A positive offset lifts the icon.
export const iconImageClasses = 'inline object-contain align-middle'
export const iconImageStyle = {
  height: 'var(--icon-height)',
  width: 'var(--icon-width)',
  translate: '0 calc(-1 * var(--icon-vertical-offset))',
  marginInline: 'var(--icon-side-spacing)',
}

// The picture that stands in for the icon name inside the editable text.
// It remembers the icon by id, so a renamed icon keeps its place in the text.
export function createIconImage(icon: TextIcon) {
  const image = document.createElement('img')
  image.src = icon.image
  image.alt = icon.name
  image.dataset.iconId = String(icon.id)
  image.className = iconImageClasses
  Object.assign(image.style, iconImageStyle)
  return image
}

// Ein Stück Text; steht es für ein Icon, ist icon gesetzt und text das Wort.
export type TextOrIconPart = { text: string; icon?: TextIcon }

// Zerlegt den gespeicherten Text in Textstücke und Icons.
export function splitByIconWords(text: string) {
  const parts: TextOrIconPart[] = []
  let lastIndex = 0
  for (const match of text.matchAll(iconWordPattern())) {
    const icon = findIconByName(match[1])
    if (!icon) continue
    parts.push({ text: text.slice(lastIndex, match.index) })
    parts.push({ text: match[0], icon })
    lastIndex = match.index + match[0].length
  }
  parts.push({ text: text.slice(lastIndex) })
  return parts
}

// Turns the stored text into the nodes for the editable area: plain text
// stays text, an icon name becomes its picture.
export function textToNodes(text: string) {
  return splitByIconWords(text).map((part) =>
    part.icon ? createIconImage(part.icon) : document.createTextNode(part.text),
  )
}

// The way back: pictures become their icon's current name, line breaks a
// newline.
export function nodesToText(root: Node): string {
  return Array.from(root.childNodes)
    .map((node) => {
      if (node instanceof HTMLImageElement) return iconNameById(node.dataset.iconId)
      if (node instanceof HTMLBRElement) return '\n'
      if (node instanceof Text) return node.data
      return nodesToText(node)
    })
    .join('')
}

// Called after every keystroke and after a rename: every finished icon name
// is swapped for its picture. A name the caret is still touching is left
// alone, otherwise "Golden" would turn into the coin halfway through typing.
export function replaceTypedIconWords(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let textNode: Text | null
  while ((textNode = walker.nextNode() as Text | null)) {
    for (const match of textNode.data.matchAll(iconWordPattern())) {
      const icon = findIconByName(match[1])
      if (!icon || caretTouches(textNode, match.index + match[0].length)) continue
      const wordNode = textNode.splitText(match.index)
      wordNode.splitText(match[0].length)
      wordNode.replaceWith(createIconImage(icon))
      // The rest of this text is now a new node; the walker reaches it next.
      break
    }
  }
}

function caretTouches(textNode: Text, offset: number) {
  const selection = window.getSelection()
  return selection?.anchorNode === textNode && selection.anchorOffset === offset
}
