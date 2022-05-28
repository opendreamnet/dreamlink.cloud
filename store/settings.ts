import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import faker from 'faker'

export interface Settings {
  username: string
  ignoreInvalid: boolean
  ipfsController: any
  ipfsPrivateKey: string | null
}

// State
export const state = (): Settings => ({
  username: '',
  ignoreInvalid: true,
  ipfsController: {},
  ipfsPrivateKey: null
})

export type State = ReturnType<typeof state>

// Getters
export const getters = getterTree(state, {
})

// Mutations
export const mutations = mutationTree(state, {
  setUsername(state, value: string) {
    state.username = value
  },

  setIgnoreInvalid(state, value: boolean) {
    state.ignoreInvalid = value
  },

  setIpfsController(state, value: any) {
    state.ipfsController = value
  },

  setIpfsPrivateKey(state, value: string | null) {
    state.ipfsPrivateKey = value
  },

  setDefaults(state) {
    state.username = faker.internet.userName()
    state.ignoreInvalid = true
    state.ipfsController = {}
  }
})

// Actions
export const actions = actionTree({ state, getters, mutations }, {
  /**
   * Returns the settings stored in localStorage.
   */
  async getSettings(): Promise<Settings | null> {
    const text = localStorage.getItem('settings')

    if (!text) {
      return null
    }

    return JSON.parse(text)
  },

  /**
   * Restore settings from localStorage.
   */
  async setup({ commit }): Promise<void> {
    const settings = await this.app.$accessor.settings.getSettings()

    if (!settings) {
      commit('setDefaults')
      this.app.$accessor.settings.save()
      return
    }

    commit('setUsername', settings.username)
    commit('setIgnoreInvalid', settings.ignoreInvalid)
    commit('setIpfsController', settings.ipfsController)
    commit('setIpfsPrivateKey', settings.ipfsPrivateKey)
  },

  /**
   * Save settings to localStorage.
   */
  async save({ state }): Promise<void> {
    localStorage.setItem('settings', JSON.stringify(state))
  },

  /**
   * Restart the IPFS node and settings.
   */
  async reset({ commit }): Promise<void> {
    commit('setDefaults')
    await this.app.$accessor.settings.save()
  }
})