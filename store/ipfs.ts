import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import queryString from 'query-string'
import { ipfs } from '~/modules/ipfs'

// State
export const state = () => ({
  avatarURL: 'https://avatars.dicebear.com/api/initials/NA.svg',
  appCID: null as string | null
})

export type State = ReturnType<typeof state>

// Getters
export const getters = getterTree(state, {
})

// Mutations
export const mutations = mutationTree(state, {
  setAvatarURL(state, url: string) {
    state.avatarURL = url
  },

  setAppCID(state, cid: string) {
    state.appCID = cid
  }
})

// Actions
export const actions = actionTree({ state, getters, mutations }, {
  /**
   * Start the IPFS node using the local settings.
   */
  async start(): Promise<void> {
    const { ipfsPrivateKey, remoteEndpoint } = this.app.$accessor.settings

    console.time('ipfs.start')
    await ipfs.start({
      privateKey: ipfsPrivateKey || undefined,
      // controller: ipfsController,
      apiAddr: remoteEndpoint || undefined
    })
    console.timeEnd('ipfs.start')

    /*
    this.app.$accessor.ipfs.getAvatarURL().then(avatarURL => {
      commit('setAvatarURL', avatarURL)
      return avatarURL
    }).catch(noop)

    */

    // this.app.$accessor.ipfs.fetchWebCID().catch(noop)
  },

  /**
   *
   *
   * @param { commit }
   */
  async fetchAppCID({ commit }, value: string): Promise<void> {
    if (!this.$ipfs.api) {
      throw new Error('IPFS API undefined!')
    }

    const cid = await this.$ipfs.api.dns(value)
    commit('setAppCID', cid.substring(6))
  },

  /**
   *
   *
   * @param [peerId]
   */
  getAvatarURL({}, peerId?: string): string {
    if (!peerId) {
      peerId = ipfs.identity?.id.toString() || 'unknown'
    }

    // https://avatars.dicebear.com/styles/micah#style-options
    const query = {
      width: 130,
      height: 130,
      earringsProbability: 50,
      glassesProbability: 50,
      mouth: [
        'laughing',
        'nervous',
        'smile',
        'smirk'
      ],
      baseColor: [
        'apricot',
        'coast',
        'topaz',
        'lavender',
        'salmon'
      ]
    }

    return `https://avatars.dicebear.com/api/micah/${peerId}.svg?${queryString.stringify(query)}`
  },

  /**
   * Delete all unpinned objects.
   */
  async freeUpStorage(): Promise<void> {
    if (!this.$ipfs.api) {
      throw new Error('IPFS API undefined!')
    }

    for await (const data of this.$ipfs.api.repo.gc()) {
      // nothing
    }

    this.$events.emit('storage.gc')
    this.$events.emit('storage.refresh')
  },

  /**
   * Create a random private key for a new identity.
   */
  async resetIdentity(): Promise<PrivateKey> {
    const privateKey = await PrivateKey.fromRandom()

    this.app.$accessor.settings.setIpfsPrivateKey(privateKey.toProtobuf())
    this.app.$accessor.settings.save()

    return privateKey
  }
})
