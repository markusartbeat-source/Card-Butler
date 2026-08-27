// One button on the right side of the header. The key comes back with the
// click, so the page knows which button was pressed.
import type { IconName } from '../atoms/icons'

export type HeaderButton = {
  key: string
  label: string
  icon?: IconName
  variant?: 'primary' | 'secondary' | 'light' | 'ghost'
}
