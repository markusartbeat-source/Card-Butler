import { downloadZip } from 'client-zip'

// One picture inside the zip: its path — folder and file name — and the file.
export type ZipEntry = { name: string; input: Blob }

// Packs the pictures into a zip file. The pictures come as an async iterator, so
// every finished one goes straight into the zip instead of all of them waiting
// in memory first. Saving is a separate step, so the export can decide when the
// browser is asked to download.
export function packCardsIntoZip(entries: AsyncIterable<ZipEntry>) {
  return downloadZip(entries).blob()
}

// Lets the browser save a finished file.
export function saveZipFile(zipFile: Blob, fileName: string) {
  const zipUrl = URL.createObjectURL(zipFile)

  // A link that is clicked without ever being seen — the only way a page can
  // hand the browser a file to save.
  const downloadLink = document.createElement('a')
  downloadLink.href = zipUrl
  downloadLink.download = fileName
  downloadLink.click()

  URL.revokeObjectURL(zipUrl)
}
