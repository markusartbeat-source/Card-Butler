// Every icon used in the app is registered here, so the bundler only ships
// the ones we actually need. Add a new line per icon, then use its key in
// <CbIcon name="..." />.
import Add2 from '~icons/material-symbols/add-2-rounded'
import ArrowCircleUp from '~icons/material-symbols/arrow-circle-up-outline-rounded'
import Filter from '~icons/material-symbols/filter-outline-rounded'
import Home from '~icons/material-symbols/home-outline-rounded'
import PlayingCards from '~icons/material-symbols/playing-cards-outline-rounded'
import Settings from '~icons/material-symbols/settings-outline-rounded'

export const icons = {
  add_2: Add2,
  arrow_circle_up: ArrowCircleUp,
  filter: Filter,
  home: Home,
  playing_cards: PlayingCards,
  settings: Settings,
}

export type IconName = keyof typeof icons
