import EventEmitter from 'events'
export const events = new EventEmitter()
export const $ = events

events.setMaxListeners(50)
