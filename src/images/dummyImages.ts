/* Placeholder pictures until real uploads exist. Each one is a gradient
   surface with a fixed aspect ratio, so the gallery rows look like the
   design without loading any image files. The gradient classes use the
   colour variables from colors.css. */
export type DummyImage = {
  id: string
  gradientClasses: string
  /* Width and height of the picture's aspect ratio, e.g. 4 and 3 for 4:3. */
  ratioWidth: number
  ratioHeight: number
}

const gradients = [
  'from-cursor-blue to-cursor-purple',
  'from-cursor-red to-cursor-orange',
  'from-cursor-green to-cursor-blue',
  'from-cursor-purple to-cursor-pink',
  'from-gold-dark to-gold-lighter',
]

const ratios = [
  { ratioWidth: 4, ratioHeight: 5 },
  { ratioWidth: 4, ratioHeight: 3 },
  { ratioWidth: 1, ratioHeight: 1 },
  { ratioWidth: 9, ratioHeight: 16 },
  { ratioWidth: 3, ratioHeight: 4 },
]

export const dummyImages: DummyImage[] = Array.from({ length: 15 }, (_, index) => ({
  id: `image-${index + 1}`,
  gradientClasses: gradients[index % gradients.length],
  ...ratios[(index * 2) % ratios.length],
}))
