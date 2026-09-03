// A PNG knows no millimetres, only pixels. How large the picture is meant to be
// printed lives in one small extra chunk called "pHYs". Programs like Affinity
// or InDesign read it and place the picture at its real size; without it they
// guess, which is why an exported card lands in any size but the right one.

// A PNG is a signature followed by chunks. Every chunk is: 4 bytes length,
// 4 bytes name, the data, 4 bytes checksum. The first chunk is always IHDR with
// exactly 13 bytes of data, so the pHYs chunk goes right behind it.
const pngSignatureLength = 8
const headerChunkLength = 4 + 4 + 13 + 4

const chunkName = 'pHYs'
const metresPerInch = 0.0254
// The unit the chunk counts in: 1 stands for one metre.
const metreUnit = 1

// The checksum the PNG format asks for over name and data of a chunk.
function chunkChecksum(bytes: Uint8Array) {
  let checksum = 0xffffffff
  for (const byte of bytes) {
    checksum ^= byte
    for (let bit = 0; bit < 8; bit++) {
      checksum = checksum & 1 ? (checksum >>> 1) ^ 0xedb88320 : checksum >>> 1
    }
  }
  return (checksum ^ 0xffffffff) >>> 0
}

// The finished pHYs chunk: how many pixels of the picture make up one metre,
// the same in both directions so nothing gets stretched.
function resolutionChunk(dpi: number) {
  const pixelsPerMetre = Math.round(dpi / metresPerInch)

  const chunk = new Uint8Array(4 + 4 + 9 + 4)
  const numbers = new DataView(chunk.buffer)

  numbers.setUint32(0, 9)
  chunk.set([...chunkName].map((letter) => letter.charCodeAt(0)), 4)
  numbers.setUint32(8, pixelsPerMetre)
  numbers.setUint32(12, pixelsPerMetre)
  chunk[16] = metreUnit
  numbers.setUint32(17, chunkChecksum(chunk.subarray(4, 17)))

  return chunk
}

// Gives back the same picture with the resolution written into it.
export async function withPngResolution(pngFile: Blob, dpi: number) {
  const pngBytes = new Uint8Array(await pngFile.arrayBuffer())
  const insertAt = pngSignatureLength + headerChunkLength

  return new Blob(
    [pngBytes.subarray(0, insertAt), resolutionChunk(dpi), pngBytes.subarray(insertAt)],
    { type: 'image/png' },
  )
}
