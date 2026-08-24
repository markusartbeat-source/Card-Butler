// Every icon used in the app is registered here, so the bundler only ships
// the ones we actually need. Add a new line per icon, then use its key in
// <CbIcon name="..." />.
import Add2 from '~icons/material-symbols/add-2-rounded'
import ArrowCircleUp from '~icons/material-symbols/arrow-circle-up-outline-rounded'
import Filter from '~icons/material-symbols/filter-outline-rounded'
import Forum from '~icons/material-symbols/forum-outline-rounded'
import Home from '~icons/material-symbols/home-outline-rounded'
import MoreHoriz from '~icons/material-symbols/more-horiz'
import PlayingCards from '~icons/material-symbols/playing-cards-outline-rounded'
import Search from '~icons/material-symbols/search-rounded'
import Settings from '~icons/material-symbols/settings-outline-rounded'
import Share from '~icons/material-symbols/share-outline'

export const icons = {
  add_2: Add2,
  arrow_circle_up: ArrowCircleUp,
  filter: Filter,
  forum: Forum,
  home: Home,
  more_horiz: MoreHoriz,
  playing_cards: PlayingCards,
  search: Search,
  settings: Settings,
  share: Share,
}

export type IconName = keyof typeof icons
