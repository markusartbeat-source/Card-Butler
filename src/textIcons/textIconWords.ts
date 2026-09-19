import { textIcons, type TextIcon } from './textIconList'

// An icon is placed by typing its name as a word of its own: "Gold" or
// "gold" becomes the coin, "Golden" stays text. Only letters count as
// neighbours, so "+4Gold" still works.
function iconWordPattern() {
  const names = textIcons.value.map((icon) => icon.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`(?<!\\p{L})(${names.join('|')})(?!\\p{L})`, 'giu')
}

function findIconByName(name: string) {
  return textIcons.value.find((icon) => icon.name.toLowerCase() === name.toLowerCase())
}

// The picture that stands in for the icon name inside the editable text.
export function createIconImage(icon: TextIcon) {
  const image = document.createElement('img')
  image.src = icon.image
  image.alt = icon.name
  image.dataset.iconName = icon.name
  image.className = 'inline align-middle'
  image.style.height = '1em'
  return image
}

// Turns the stored text into the nodes for the editable area: plain text
// stays text, an icon name becomes its picture.
export function textToNodes(text: string) {
  const nodes: Node[] = []
  let lastIndex = 0
  for (const match of text.matchAll(iconWordPattern())) {
    const icon = findIconByName(match[1])
    if (!icon) continue
    nodes.push(document.createTextNode(text.slice(lastIndex, match.index)))
    nodes.push(createIconImage(icon))
    lastIndex = match.index + match[0].length
  }
  nodes.push(document.createTextNode(text.slice(lastIndex)))
  return nodes
}

// The way back: pictures become their icon name, line breaks a newline.
export function nodesToText(root: Node): string {
  return Array.from(root.childNodes)
    .map((node) => {
      if (node instanceof HTMLImageElement) return node.dataset.iconName ?? ''
      if (node instanceof HTMLBRElement) return '\n'
      if (node instanceof Text) return node.data
      return nodesToText(node)
    })
    .join('')
}

// Called after every keystroke: a finished icon name is swapped for its
// picture. A name the caret is still touching is left alone, otherwise
// "Golden" would turn into the coin halfway through typing it.
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
      return
    }
  }
}

function caretTouches(textNode: Text, offset: number) {
  const selection = window.getSelection()
  return selection?.anchorNode === textNode && selection.anchorOffset === offset
}
