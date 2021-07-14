import EventEmitter from 'events'
export const events = new EventEmitter()

events.setMaxListeners(50)