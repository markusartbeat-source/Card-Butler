import type { IconName } from '../atoms/icons'

/** One entry of a toolbar. The name is its text — a bar either shows it next to
    the icon or keeps it as the tooltip. */
export type ToolbarElement = {
  name: string
  icon: IconName
}
