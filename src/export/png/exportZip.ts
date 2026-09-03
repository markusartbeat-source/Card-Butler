import { downloadZip } from 'client-zip'

// One picture inside the zip: its path — folder and file name — and the file.
export type ZipEntry = { name: string; input: Blob }

// Packs the pictures into a zip file and lets the browser save it. The pictures
// come as an async iterator, so every finished one goes straight into the zip
// instead of all of them waiting in memory first.
export async function downloadCardsZip(entries: AsyncIterable<ZipEntry>, fileName: string) {
  const zipFile = await downloadZip(entries).blob()
  const zipUrl = URL.createObjectURL(zipFile)

  // A link that is clicked without ever being seen — the only way a page can
  // hand the browser a file to save.
  const downloadLink = document.createElement('a')
  downloadLink.href = zipUrl
  downloadLink.download = fileName
  downloadLink.click()

  URL.revokeObjectURL(zipUrl)
}
