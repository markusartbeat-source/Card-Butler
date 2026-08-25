import { ref, watch, type Ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
  listenOnProjectChannel,
  mySenderId,
  openProjectChannel,
  projectChannel,
} from '../realtime/projectChannel'
import { useMyIdentity } from '../livecursors/cursorIdentity'

/** Who somebody is and where in the app they are. Sent on change, not per mouse move. */
export type Person = { name: string; color: string; area: string; pictureUrl?: string }

// Supabase closes the channel above 5 presence calls per client per 30 seconds,
// so we keep a safe gap between them — see the throttle in startPresence.
const minimumTrackGapMs = 7000

const people = ref<Record<string, Person>>({})

// Presence always hands over the full list, so people who left simply drop out.
function readPeople(channel: RealtimeChannel) {
  const state = channel.presenceState<Person>()
  const others: Record<string, Person> = {}

  for (const [senderId, entries] of Object.entries(state)) {
    if (senderId === mySenderId) continue
    const { name, color, area, pictureUrl } = entries[0]
    others[senderId] = { name, color, area, pictureUrl }
  }

  people.value = others

  // Debug output while we hunt the dying channel — remove once it holds.
  console.log(
    'received others:',
    Object.values(others).map((person) => `${person.name} in ${person.area || 'nowhere'}`),
  )
}

/**
 * Opens the channel once when the app starts and keeps telling the others
 * who I am and which area I am looking at.
 */
export function startPresence(myArea: Ref<string>) {
  const myIdentity = useMyIdentity()

  let lastTrackAt = 0
  let plannedTrack = 0

  function sendMyself() {
    lastTrackAt = Date.now()

    projectChannel()
      ?.track({
        name: myIdentity.name.value,
        color: myIdentity.color.value,
        area: myArea.value,
        pictureUrl: myIdentity.pictureUrl.value,
      })
      // Debug output while we hunt the dying channel — remove once it holds.
      .then((result) => console.log('sent my area:', myArea.value, '->', result))
  }

  // Clicking quickly through the pages must not cost one message per click:
  // an already planned message is replaced by the newer one.
  function trackMyself() {
    window.clearTimeout(plannedTrack)
    const waitMs = Math.max(0, minimumTrackGapMs - (Date.now() - lastTrackAt))
    plannedTrack = window.setTimeout(sendMyself, waitMs)
  }

  listenOnProjectChannel((channel) =>
    channel.on('presence', { event: 'sync' }, () => readPeople(channel)),
  )

  // Every fresh channel starts empty, so I say who I am right after joining.
  openProjectChannel(trackMyself)

  // Signing in or changing the page — the others have to hear about it.
  watch([myIdentity.name, myIdentity.color, myArea], trackMyself)
}

/** The other people in the project, without me. */
export function usePresence() {
  return { people }
}
