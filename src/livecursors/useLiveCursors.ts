import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import type { CursorAnchor } from './cursorAnchor'
import { useMyIdentity } from './cursorIdentity'

/** Who somebody is. Sent once via Presence, not with every mouse move. */
type Person = { name: string; color: string }

/** Where somebody is. Sent about 20 times per second via Broadcast. */
type CursorPosition = { senderId: string; anchor: CursorAnchor | null }

export type ForeignCursor = CursorPosition & Person

// Only one project exists so far, so the channel name is still fixed.
const channelName = 'projekt-1'
// About 20 messages per second — the smoothing happens at the receiver.
const sendIntervalMs = 50

/**
 * Sends my own cursor to everybody else in the project and collects theirs.
 * Returns the cursors of the other people, without my own.
 */
export function useLiveCursors(myAnchor: Ref<CursorAnchor | null>) {
  const myIdentity = useMyIdentity()
  // One id per browser tab: the same person may have two windows open.
  const mySenderId = crypto.randomUUID()

  const positions = ref<CursorPosition[]>([])
  const people = ref<Record<string, Person>>({})

  // Somebody who has left, or whose name has not arrived yet, is not drawn.
  const foreignCursors = computed<ForeignCursor[]>(() =>
    positions.value.flatMap((position) => {
      const person = people.value[position.senderId]
      return person ? [{ ...position, ...person }] : []
    }),
  )

  let channel: RealtimeChannel | null = null
  let sendTimer = 0
  let lastSentAnchor = ''

  function sendWhenChanged() {
    const anchorAsText = JSON.stringify(myAnchor.value)
    if (anchorAsText === lastSentAnchor) return
    lastSentAnchor = anchorAsText

    channel?.send({
      type: 'broadcast',
      event: 'cursor',
      payload: { senderId: mySenderId, anchor: myAnchor.value },
    })
  }

  function receivePosition(position: CursorPosition) {
    const known = positions.value.find((other) => other.senderId === position.senderId)
    if (known) known.anchor = position.anchor
    else positions.value.push(position)
  }

  // Presence always hands over the full list, so people who left simply drop out.
  function readPeople() {
    const state = channel?.presenceState<Person>() ?? {}
    const others: Record<string, Person> = {}

    for (const [senderId, entries] of Object.entries(state)) {
      if (senderId === mySenderId) continue
      others[senderId] = { name: entries[0].name, color: entries[0].color }
    }

    people.value = others
  }

  function trackMyself() {
    channel?.track({ name: myIdentity.name.value, color: myIdentity.color.value })
  }

  onMounted(() => {
    channel = supabase
      .channel(channelName, { config: { presence: { key: mySenderId } } })
      .on('broadcast', { event: 'cursor' }, ({ payload }) =>
        receivePosition(payload as CursorPosition),
      )
      .on('presence', { event: 'sync' }, readPeople)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') trackMyself()
      })

    sendTimer = window.setInterval(sendWhenChanged, sendIntervalMs)
  })

  // Signing in changes my name and color — the others have to hear about it.
  watch([myIdentity.name, myIdentity.color], trackMyself)

  onUnmounted(() => {
    window.clearInterval(sendTimer)
    if (channel) supabase.removeChannel(channel)
  })

  return { foreignCursors }
}
