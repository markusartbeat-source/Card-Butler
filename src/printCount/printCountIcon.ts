import type { IconName } from '../components/atoms/icons'

/** Das Icon zur Druckanzahl: bei 0 der durchgestrichene Drucker, sonst der Stapel. */
export function printCountIcon(printCount: number): IconName {
  return printCount === 0 ? 'print_disabled' : 'stacks'
}
