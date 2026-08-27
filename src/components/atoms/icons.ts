// Every icon used in the app is registered here, so the bundler only ships
// the ones we actually need. Add a new line per icon, then use its key in
// <CbIcon name="..." />.
import Add2 from '~icons/material-symbols/add-2-rounded'
import AddComment from '~icons/material-symbols/add-comment-outline-rounded'
import ArrowCircleUp from '~icons/material-symbols/arrow-circle-up-outline-rounded'
import Check from '~icons/material-symbols/check-rounded'
import Circle from '~icons/material-symbols/circle-outline'
import Close from '~icons/material-symbols/close-rounded'
import DarkMode from '~icons/material-symbols/dark-mode-outline-rounded'
import DoorOpen from '~icons/material-symbols/door-open-outline-rounded'
import Filter from '~icons/material-symbols/filter-outline-rounded'
// Flags keep their own colours, they are not tinted like the symbols above.
import FlagDe from '~icons/flag/de-4x3'
import FlagGb from '~icons/flag/gb-4x3'
import Forum from '~icons/material-symbols/forum-outline-rounded'
import Home from '~icons/material-symbols/home-outline-rounded'
import HorizontalRule from '~icons/material-symbols/horizontal-rule-rounded'
import Image from '~icons/material-symbols/image-outline-rounded'
import KeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import LightMode from '~icons/material-symbols/light-mode-outline-rounded'
import LocationOn from '~icons/material-symbols/location-on-outline-rounded'
import Login from '~icons/material-symbols/login-rounded'
import MoreHoriz from '~icons/material-symbols/more-horiz'
import PlayingCards from '~icons/material-symbols/playing-cards-outline-rounded'
import Search from '~icons/material-symbols/search-rounded'
import Settings from '~icons/material-symbols/settings-outline-rounded'
import Share from '~icons/material-symbols/share-outline'
import Square from '~icons/material-symbols/square-outline-rounded'
import Title from '~icons/material-symbols/title-rounded'

export const icons = {
  add_2: Add2,
  add_comment: AddComment,
  arrow_circle_up: ArrowCircleUp,
  check: Check,
  circle: Circle,
  close: Close,
  dark_mode: DarkMode,
  door_open: DoorOpen,
  filter: Filter,
  flag_de: FlagDe,
  flag_gb: FlagGb,
  forum: Forum,
  home: Home,
  horizontal_rule: HorizontalRule,
  image: Image,
  keyboard_arrow_down: KeyboardArrowDown,
  light_mode: LightMode,
  location_on: LocationOn,
  login: Login,
  more_horiz: MoreHoriz,
  playing_cards: PlayingCards,
  search: Search,
  settings: Settings,
  share: Share,
  square: Square,
  title: Title,
}

export type IconName = keyof typeof icons
