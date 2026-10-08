// Die Poststelle: einziger Weg der App zum Backend. Jedes Thema hat hier sein
// Fach, damit an jeder Aufrufstelle sichtbar ist, dass es ans Backend geht –
// z.B. `postOffice.user.signOut()`. Die Logik steckt in den Themen-Ordnern.
import { userApi } from '../user/userApi'

export const postOffice = { user: userApi }
