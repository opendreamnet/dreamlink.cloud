import Dexie from 'dexie'

export interface IPin {
  cid: string
  name?: string
  size?: number
  date?: string
}

class StorageDatabase extends Dexie {
  public pins: Dexie.Table<IPin, string>

  public constructor() {
    super('storage')

    this.version(1).stores({
      pins: 'cid, name, size, date'
    })

    this.pins = this.table('pins')
  }
}

export const storageDb = new StorageDatabase()