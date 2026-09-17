// Every icon used in the app is registered here, so the bundler only ships
// the ones we actually need. Add a new line per icon, then use its key in
// <CbIcon name="..." />.
import Add2 from '~icons/material-symbols/add-2-rounded'
import AddComment from '~icons/material-symbols/add-comment-outline-rounded'
import ArrowCircleUp from '~icons/material-symbols/arrow-circle-up-outline-rounded'
import ArtTrack from '~icons/material-symbols/art-track-outline-rounded'
import Check from '~icons/material-symbols/check-rounded'
import Circle from '~icons/material-symbols/circle-outline'
import Close from '~icons/material-symbols/close-rounded'
import Colorize from '~icons/material-symbols/colorize-outline-rounded'
import CropFree from '~icons/material-symbols/crop-free-rounded'
import DarkMode from '~icons/material-symbols/dark-mode-outline-rounded'
import Delete from '~icons/material-symbols/delete-outline-rounded'
import DoorOpen from '~icons/material-symbols/door-open-outline-rounded'
import East from '~icons/material-symbols/east-rounded'
import Filter from '~icons/material-symbols/filter-outline-rounded'
// Flags keep their own colours, they are not tinted like the symbols above.
import FlagBr from '~icons/flag/br-4x3'
import FlagDe from '~icons/flag/de-4x3'
import FlagEs from '~icons/flag/es-4x3'
import FlagFr from '~icons/flag/fr-4x3'
import FlagGb from '~icons/flag/gb-4x3'
import FormatLetterSpacingWider from '~icons/material-symbols/format-letter-spacing-wider-rounded'
import Forum from '~icons/material-symbols/forum-outline-rounded'
import Home from '~icons/material-symbols/home-outline-rounded'
import HorizontalRule from '~icons/material-symbols/horizontal-rule-rounded'
import Image from '~icons/material-symbols/image-outline-rounded'
import Info from '~icons/material-symbols/info-outline-rounded'
import KeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded'
import LightMode from '~icons/material-symbols/light-mode-outline-rounded'
import Link from '~icons/material-symbols/link-rounded'
import LocationOn from '~icons/material-symbols/location-on-outline-rounded'
import Login from '~icons/material-symbols/login-rounded'
import ManageAccounts from '~icons/material-symbols/manage-accounts-outline-rounded'
import MoreHoriz from '~icons/material-symbols/more-horiz'
// One arrow per card corner, used by the single corner radius fields.
import NorthEast from '~icons/material-symbols/north-east-rounded'
import NorthWest from '~icons/material-symbols/north-west-rounded'
import PhotoLibrary from '~icons/material-symbols/photo-library-outline-rounded'
import PlayingCards from '~icons/material-symbols/playing-cards-outline-rounded'
import Print from '~icons/material-symbols/print-outline-rounded'
// The looping arrow of the material symbol called "360".
import Rotate360 from '~icons/material-symbols/360-rounded'
import Search from '~icons/material-symbols/search-rounded'
import SouthEast from '~icons/material-symbols/south-east-rounded'
import SouthWest from '~icons/material-symbols/south-west-rounded'
import Settings from '~icons/material-symbols/settings-outline-rounded'
import Share from '~icons/material-symbols/share-outline'
import Square from '~icons/material-symbols/square-outline-rounded'
import Stacks from '~icons/material-symbols/stacks-rounded'
import SupportAgent from '~icons/material-symbols/support-agent-outline-rounded'
import Title from '~icons/material-symbols/title-rounded'
import Undo from '~icons/material-symbols/undo-rounded'
import VerticalAlignCenter from '~icons/material-symbols/vertical-align-center-rounded'
import West from '~icons/material-symbols/west-rounded'

export const icons = {
  add_2: Add2,
  add_comment: AddComment,
  arrow_circle_up: ArrowCircleUp,
  art_track: ArtTrack,
  check: Check,
  circle: Circle,
  close: Close,
  colorize: Colorize,
  crop_free: CropFree,
  dark_mode: DarkMode,
  delete: Delete,
  door_open: DoorOpen,
  east: East,
  filter: Filter,
  flag_br: FlagBr,
  flag_de: FlagDe,
  flag_es: FlagEs,
  flag_fr: FlagFr,
  flag_gb: FlagGb,
  format_letter_spacing_wider: FormatLetterSpacingWider,
  forum: Forum,
  home: Home,
  horizontal_rule: HorizontalRule,
  image: Image,
  info: Info,
  keyboard_arrow_down: KeyboardArrowDown,
  light_mode: LightMode,
  link: Link,
  location_on: LocationOn,
  login: Login,
  manage_accounts: ManageAccounts,
  more_horiz: MoreHoriz,
  north_east: NorthEast,
  north_west: NorthWest,
  photo_library: PhotoLibrary,
  playing_cards: PlayingCards,
  print: Print,
  rotate_360: Rotate360,
  search: Search,
  settings: Settings,
  share: Share,
  south_east: SouthEast,
  south_west: SouthWest,
  square: Square,
  stacks: Stacks,
  support_agent: SupportAgent,
  title: Title,
  undo: Undo,
  vertical_align_center: VerticalAlignCenter,
  west: West,
}

export type IconName = keyof typeof icons
