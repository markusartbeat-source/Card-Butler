// Every icon used in the app is registered here, so the bundler only ships
// the ones we actually need. Add a new line per icon, then use its key in
// <CbIcon name="..." />.
import Add2 from '~icons/material-symbols/add-2-rounded'
import ArrowCircleUp from '~icons/material-symbols/arrow-circle-up-outline-rounded'
import Circle from '~icons/material-symbols/circle-outline'
import Close from '~icons/material-symbols/close-rounded'
import Comment from '~icons/material-symbols/comment-outline-rounded'
import Filter from '~icons/material-symbols/filter-outline-rounded'
import Forum from '~icons/material-symbols/forum-outline-rounded'
import Home from '~icons/material-symbols/home-outline-rounded'
import HorizontalRule from '~icons/material-symbols/horizontal-rule-rounded'
import Image from '~icons/material-symbols/image-outline-rounded'
import MoreHoriz from '~icons/material-symbols/more-horiz'
import PlayingCards from '~icons/material-symbols/playing-cards-outline-rounded'
import Rectangle from '~icons/material-symbols/rectangle-outline-rounded'
import Search from '~icons/material-symbols/search-rounded'
import Settings from '~icons/material-symbols/settings-outline-rounded'
import Share from '~icons/material-symbols/share-outline'
import TextFields from '~icons/material-symbols/text-fields-rounded'

export const icons = {
  add_2: Add2,
  arrow_circle_up: ArrowCircleUp,
  circle: Circle,
  close: Close,
  comment: Comment,
  filter: Filter,
  forum: Forum,
  home: Home,
  horizontal_rule: HorizontalRule,
  image: Image,
  more_horiz: MoreHoriz,
  playing_cards: PlayingCards,
  rectangle: Rectangle,
  search: Search,
  settings: Settings,
  share: Share,
  text_fields: TextFields,
}

export type IconName = keyof typeof icons
