// Die Poststelle: einziger Weg der App zum Backend. Jedes Thema hat hier sein
// Fach, damit an jeder Aufrufstelle sichtbar ist, dass es ans Backend geht –
// z.B. `postOffice.user.signOut()`. Die Logik steckt in den Themen-Ordnern.
import { cardSetsApi } from '../cardSets/cardSetsApi'
import { cardsApi } from '../cards/cardsApi'
import { elementsApi } from '../elements/elementsApi'
import { projectsApi } from '../projects/projectsApi'
import { userApi } from '../user/userApi'

export const postOffice = {
  user: userApi,
  projects: projectsApi,
  cardSets: cardSetsApi,
  cards: cardsApi,
  elements: elementsApi,
}
