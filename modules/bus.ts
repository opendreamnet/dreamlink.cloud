import EventEmitter from 'events'

export const bus = new EventEmitter()

bus.setMaxListeners(30)