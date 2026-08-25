import { ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase, supabaseAnonKey, supabaseUrl } from '../supabase'

const channelName = 'projekt-1'

// One id per browser tab: the same person may have two windows open.
export const mySenderId = crypto.randomUUID()

/** True while the channel really carries messages. */
export const isProjectChannelJoined = ref(false)

const listeners: ((channel: RealtimeChannel) => void)[] = []
const joinedCallbacks: (() => void)[] = []
let currentChannel: RealtimeChannel | null = null

/** The channel to send on, or null while nothing can be sent. */
export function projectChannel() {
  return isProjectChannelJoined.value ? currentChannel : null
}

/**
 * Sends one last message while the window is closing. The WebSocket dies with
 * the window, so this goes over Supabase's HTTP broadcast endpoint instead:
 * a "keepalive" request is the only kind a browser finishes after unload.
 */
export function sendWhileClosing(event: string, payload: unknown) {
  fetch(`${supabaseUrl}/realtime/v1/api/broadcast`, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json', apikey: supabaseAnonKey },
    body: JSON.stringify({ messages: [{ topic: channelName, event, payload }] }),
  })
}

/**
 * Registers a listener for the one project channel. It is put on every fresh
 * channel again, so it has to be registered before the channel is opened.
 */
export function listenOnProjectChannel(listener: (channel: RealtimeChannel) => void) {
  listeners.push(listener)
}

/**
 * Opens the one channel of the project when the app starts. Callers may ask
 * for it more than once — the channel itself is built only the first time,
 * because Supabase refuses to join the same channel twice.
 */
export function openProjectChannel(onJoined: () => void) {
  joinedCallbacks.push(onJoined)
  if (currentChannel) return

  const channel = supabase.channel(channelName)
  currentChannel = channel

  for (const listener of listeners) listener(channel)

  channel.subscribe((status) => {
    isProjectChannelJoined.value = status === 'SUBSCRIBED'
    if (status === 'SUBSCRIBED') for (const callback of joinedCallbacks) callback()
  })
}
