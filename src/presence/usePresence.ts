import { ref, watch, type Ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { useMyIdentity } from '../livecursors/cursorIdentity'

/** Who somebody is and where in the app they are. Sent on change, not per mouse move. */
export type Person = { name: string; color: string; area: string }

// One id per browser tab: the same person may have two windows open.
export const mySenderId = crypto.randomUUID()

// Only one project exists so far, so the channel name is still fixed.
const channelName = 'projekt-1-presence'

const people = ref<Record<string, Person>>({})
let channel: RealtimeChannel | null = null

// Presence always hands over the full list, so people who left simply drop out.
function readPeople() {
  const state = channel?.presenceState<Person>() ?? {}
  const others: Record<string, Person> = {}

  for (const [senderId, entries] of Object.entries(state)) {
    if (senderId === mySenderId) continue
    const { name, color, area } = entries[0]
    others[senderId] = { name, color, area }
  }

  people.value = others
}

/**
 * Opens the channel once when the app starts and keeps telling the others
 * who I am and which area I am looking at.
 */
export function startPresence(myArea: Ref<string>) {
  const myIdentity = useMyIdentity()

  function trackMyself() {
    channel?.track({ name: myIdentity.name.value, color: myIdentity.color.value, area: myArea.value })
  }

  channel = supabase
    .channel(channelName, { config: { presence: { key: mySenderId } } })
    .on('presence', { event: 'sync' }, readPeople)
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') trackMyself()
    })

  // Signing in or changing the page — the others have to hear about it.
  watch([myIdentity.name, myIdentity.color, myArea], trackMyself)
}

/** The other people in the project, without me. */
export function usePresence() {
  return { people }
}
