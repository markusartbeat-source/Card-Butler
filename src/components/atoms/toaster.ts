// The app's single toast queue. Import showToast anywhere to show a message.
import { createToaster } from '@ark-ui/vue'

export const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 16 })

export function showToast(title: string, description?: string) {
  toaster.create({ title, description })
}

export function showSuccessToast(title: string, description?: string) {
  toaster.success({ title, description })
}

export function showDangerToast(title: string, description?: string) {
  toaster.error({ title, description })
}
