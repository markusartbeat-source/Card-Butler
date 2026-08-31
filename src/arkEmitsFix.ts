// Ark UI 5.39 lets its Root components fire "enterComplete" without listing it
// in their own emits option, so Vue warns every time one of them opens. Adding
// the missing entry here fixes all of them at once, instead of every component
// having to carry a workaround. Can be deleted once Ark UI ships the fix.
import { ColorPicker, Select, Tooltip } from '@ark-ui/vue'

const rootsWithMissingEvent = [ColorPicker.Root, Select.Root, Tooltip.Root]

for (const root of rootsWithMissingEvent) {
  const emits = (root as unknown as { emits?: string[] }).emits
  if (emits && !emits.includes('enterComplete')) emits.push('enterComplete')
}
