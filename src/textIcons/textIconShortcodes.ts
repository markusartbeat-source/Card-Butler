import { textIcons, type TextIcon } from './textIconList'

// A shortcode is the icon name in lowercase between two colons, e.g. :gold:
const shortcodePattern = /:([^\s:]+):/g

export function shortcodeOf(icon: TextIcon) {
  return `:${icon.name.toLowerCase()}:`
}

function findIconByShortcodeName(name: string) {
  return textIcons.value.find((icon) => icon.name.toLowerCase() === name.toLowerCase())
}

// The picture that stands in for a shortcode inside the editable text.
export function createIconImage(icon: TextIcon) {
  const image = document.createElement('img')
  image.src = icon.image
  image.alt = icon.name
  image.dataset.shortcode = shortcodeOf(icon)
  image.className = 'inline align-middle'
  image.style.height = '1em'
  return image
}

// Turns the stored text into the nodes for the editable area: plain text
// stays text, a known shortcode becomes its picture.
export function textToNodes(text: string) {
  const nodes: Node[] = []
  let lastIndex = 0
  for (const match of text.matchAll(shortcodePattern)) {
    const icon = findIconByShortcodeName(match[1])
    if (!icon) continue
    nodes.push(document.createTextNode(text.slice(lastIndex, match.index)))
    nodes.push(createIconImage(icon))
    lastIndex = match.index + match[0].length
  }
  nodes.push(document.createTextNode(text.slice(lastIndex)))
  return nodes
}

// The way back: pictures become their shortcode, line breaks a newline.
export function nodesToText(root: Node): string {
  return Array.from(root.childNodes)
    .map((node) => {
      if (node instanceof HTMLImageElement) return node.dataset.shortcode ?? ''
      if (node instanceof HTMLBRElement) return '\n'
      if (node instanceof Text) return node.data
      return nodesToText(node)
    })
    .join('')
}

// Called after every keystroke: if a text node now contains a complete
// shortcode of a known icon, the shortcode is swapped for the picture and the
// caret is placed right behind it, so typing can go on.
export function replaceTypedShortcodes(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let textNode: Text | null
  while ((textNode = walker.nextNode() as Text | null)) {
    for (const match of textNode.data.matchAll(shortcodePattern)) {
      const icon = findIconByShortcodeName(match[1])
      if (!icon) continue
      const shortcodeNode = textNode.splitText(match.index)
      shortcodeNode.splitText(match[0].length)
      const image = createIconImage(icon)
      shortcodeNode.replaceWith(image)
      placeCaretAfter(image)
      return
    }
  }
}

function placeCaretAfter(node: Node) {
  const range = document.createRange()
  range.setStartAfter(node)
  range.collapse(true)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
