import { ref, watch, type Ref } from 'vue'
import {
  listenOnProjectChannel,
  mySenderId,
  openProjectChannel,
  projectChannel,
} from '../realtime/projectChannel'
import { useMyIdentity } from '../livecursors/cursorIdentity'

/** Who somebody is and where in the app they are. Sent on change, not per mouse move. */
export type Person = { name: string; color: string; area: string; pictureUrl?: string }

/** A "who" message: everything the others need to show me, sent on change. */
type WhoMessage = Person & { senderId: string }

// Presence noticed by itself when somebody left; over Broadcast we repeat the
// message as a sign of life and drop whoever has been quiet for too long.
const signOfLifeIntervalMs = 5000
const forgetAfterMs = 15000

const people = ref<Record<string, Person>>({})
const lastHeardAt: Record<string, number> = {}

function receiveWho({ senderId, name, color, area, pictureUrl }: WhoMessage) {
  if (senderId === mySenderId) return
  lastHeardAt[senderId] = Date.now()
  people.value = { ...people.value, [senderId]: { name, color, area, pictureUrl } }
}

function forgetQuietPeople() {
  const tooOld = Date.now() - forgetAfterMs
  const stillHere: Record<string, Person> = {}

  for (const [senderId, person] of Object.entries(people.value)) {
    if (lastHeardAt[senderId] > tooOld) stillHere[senderId] = person
    else delete lastHeardAt[senderId]
  }

  people.value = stillHere
}

// Listening starts with the app, not with a page: the shared channel must not
// collect a new listener on every visit.
listenOnProjectChannel((channel) =>
  channel.on('broadcast', { event: 'who' }, ({ payload }) => receiveWho(payload as WhoMessage)),
)

/**
 * Tells the others who I am and which area I am looking at — over Broadcast,
 * which has no rate limit, unlike Presence.
 */
export function startPeopleBroadcast(myArea: Ref<string>) {
  const myIdentity = useMyIdentity()

  function sendMyself() {
    projectChannel()?.send({
      type: 'broadcast',
      event: 'who',
      payload: {
        senderId: mySenderId,
        name: myIdentity.name.value,
        color: myIdentity.color.value,
        area: myArea.value,
        pictureUrl: myIdentity.pictureUrl.value,
      },
    })
  }

  // Every fresh channel starts empty, so I say who I am right after joining.
  openProjectChannel(sendMyself)

  // Signing in or changing the page — the others have to hear about it.
  watch([myIdentity.name, myIdentity.color, myArea], sendMyself)

  // Repeating myself also tells a window that opened later that I am here.
  window.setInterval(() => {
    sendMyself()
    forgetQuietPeople()
  }, signOfLifeIntervalMs)
}

/** The other people in the project, without me. */
export function usePeopleBroadcast() {
  return { people }
}
