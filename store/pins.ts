/* eslint-disable no-await-in-loop */
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { DateTime } from 'luxon'
import { findIndex, orderBy } from 'lodash'
import { ipfs } from '~/modules/ipfs'
import { storageDb, IPin as IStoragePin } from '~/modules/databases/storage'

interface IPin {
  cid: string
  name: string | null
  size: number | null
  date: DateTime | null
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const state = () => ({
  items: [] as IPin[]
})

export type State = ReturnType<typeof state>

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  clear(state) {
    state.items = []
  },

  add(state, value: IPin) {
    if (value.cid === 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn') {
      // Empty folder generated when creating an IPFS node. idk
      return
    }

    const index = findIndex(state.items, { cid: value.cid })

    if (index === -1) {
      state.items.unshift(value)
    } else {
      state.items[index].name = value.name
    }
  },

  remove(state, value: string) {
    const index = findIndex(state.items, { cid: value })

    if (index >= 0) {
      state.items.splice(index, 1)
    }
  },

  sortByDate(state) {
    state.items = orderBy(state.items, (item) => (item.date || DateTime.invalid('Invalid upload date.')).toSeconds(), 'desc')
  }
})

export const actions = actionTree({ state, getters, mutations }, {
  /**
   * Fetches the pinned objects in the IPFS node
   * and obtains additional information from the IndexedDB.
   */
  async fetch({ commit }): Promise<void> {
    await ipfs.waitUntilCompleted()

    commit('clear')

    // Fetch all pinned objects in the node.
    for (const cid of ipfs.pins) {
      // Get the record in the database for name and upload date.
      const record = await storageDb.pins.where({ cid }).first()

      if (record) {
        this.app.$accessor.pins.addFromStorage(record)
      } else {
        commit('add', {
          cid,
          name: null,
          size: null,
          date: null
        })
      }
    }

    commit('sortByDate')
  },

  /**
   * Creates a new pinned object in the IndexedDB.
   * (The actual pin on the IPFS node should have already happened)
   */
  async create({}, record: IStoragePin): Promise<void> {
    if (!record.date) {
      record.date = DateTime.now().toISO()
    }

    await storageDb.pins.add(record)

    this.app.$accessor.pins.addFromStorage(record)
  },

  /**
   * Add a new pinned object with the information obtained from the IndexedDB.
   */
  addFromStorage({ commit }, record: IStoragePin): void {
    commit('add', {
      cid: record.cid,
      name: record.name || null,
      size: record.size || null,
      date: record.date ? DateTime.fromISO(record.date) : null
    })
  },

  async pin({}, record: IStoragePin) {
    await this.$ipfs.api.pin.add(record.cid)
    await this.app.$accessor.pins.create(record)
  },

  async unpin({ commit }, cid: string) {
    await this.$ipfs.api.pin.rm(cid)
    await storageDb.pins.delete(cid)
    commit('remove', cid)
  },

  async unpinAll({ commit, state }): Promise<void> {
    for (const item of state.items) {
      // eslint-disable-next-line no-await-in-loop
      await this.$ipfs.api.pin.rm(item.cid)
    }

    storageDb.pins.clear()

    commit('clear')
  }
})