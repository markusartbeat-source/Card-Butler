import { ref, watch, type Ref } from 'vue'
import {
  listenOnProjectChannel,
  mySenderId,
  openProjectChannel,
  projectChannel,
} from '../realtime/projectChannel'
import { useMyIdentity } from '../livecursors/cursorIdentity'
import type { Person } from './usePresence'

/** A "who" message: everything the others need to show me, sent on change. */
type WhoMessage = Person & { senderId: string }

const people = ref<Record<string, Person>>({})

function receiveWho({ senderId, name, color, area, pictureUrl }: WhoMessage) {
  if (senderId === mySenderId) return
  people.value = { ...people.value, [senderId]: { name, color, area, pictureUrl } }
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
}

/** The other people in the project, without me. */
export function usePeopleBroadcast() {
  return { people }
}
