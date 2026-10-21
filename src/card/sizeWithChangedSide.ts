/** Eine Größe (mm) mit neuer Breite oder Höhe. Mit keepsAspectRatio geht die
 *  andere Seite im gleichen Verhältnis mit – sofern es eins gibt, die geänderte
 *  Seite also nicht 0 war. */
export function sizeWithChangedSide(
  size: { width: number; height: number },
  side: 'width' | 'height',
  millimeters: number,
  keepsAspectRatio: boolean,
) {
  const factor = keepsAspectRatio && size[side] ? millimeters / size[side] : 1
  return { width: size.width * factor, height: size.height * factor, [side]: millimeters }
}
