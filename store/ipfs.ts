import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import queryString from 'query-string'
import { isEmpty, reduce, round } from 'lodash'
import { DateTime } from 'luxon'
import Swal from 'sweetalert2'
import type { DefaultNuxtLoading } from '@nuxt/types/app'
import { UPLOAD_DELAY } from '~/modules/defs'
import { ipfs } from '~/modules/ipfs'
import { Gateway } from '~/modules/gateway'

export interface UploadPayload {
  files: FileList
  loading: DefaultNuxtLoading
}

// State
export const state = () => ({
  nodeError: null as Error | null,
  avatarURL: 'https://avatars.dicebear.com/api/initials/NA.svg',
  appCID: null as string | null
})

export type State = ReturnType<typeof state>

// Getters
export const getters = getterTree(state, {
})

// Mutations
export const mutations = mutationTree(state, {
  setNodeError(state, err: Error) {
    state.nodeError = err
  },

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
  async start({ commit }): Promise<void> {
    try {
      const { ipfsPrivateKey, remoteEndpoint } = this.app.$accessor.settings

      // Start node with custom settings
      await ipfs.start({
        privateKey: ipfsPrivateKey || undefined,
        apiAddr: remoteEndpoint || undefined
      })

      if (ipfs.error) {
        throw ipfs.error
      }

      // Avatar
      this.app.$accessor.ipfs.fetchAvatarURL()
    } catch (err: any) {
      commit('setNodeError', err)

      console.error('Error trying to start IPFS node!')
      console.trace(err)
    }
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
  fetchAvatarURL({ commit }, peerId?: string): string {
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

    const avatarURL = `https://avatars.dicebear.com/api/micah/${peerId}.svg?${queryString.stringify(query)}`

    commit('setAvatarURL', avatarURL)

    return avatarURL
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
  },

  /**
   *
   *
   * @param {}
   * @param payload
   * @return {*}
   */
  async upload({}, payload: UploadPayload) {
    if (!ipfs.api) {
      throw new Error('IPFS API undefined!')
    }

    const { files, loading } = payload

    if (files.length === 0) {
      throw new Error('No files!')
    }

    // Show loading bar
    loading.start()

    // Total size
    const size = round(reduce(files, (accumulator, file) => accumulator + file.size, 0))

    // Uploaded size
    let uploadedBytes = 0

    // Root directory or file
    // @ts-ignore
    const root = !isEmpty(files[0].webkitRelativePath) ? files[0].webkitRelativePath.split('/')[0] : files[0].name

    // Track progress function
    const progressFunc = (bytes: number) => {
      uploadedBytes += bytes
      const percentage = (100 * uploadedBytes) / size
      loading.set(percentage)
    }

    for (let it = 0; it < files.length; ++it) {
      const file = files.item(it)!
      // @ts-ignore
      const filepath = file.webkitRelativePath || file.name

      await ipfs.api.files.write(`/.dreamlink/${filepath}`, file, {
        create: true,
        parents: true,
        mtime: DateTime.now().toJSDate(),
        progress: progressFunc
      })
    }

    const stat = await ipfs.api.files.stat(`/.dreamlink/${root}`)

    payload.loading.finish()

    return {
      cid: stat.cid.toString(),
      name: root
    }
  },

  async finishUpload({}, cid: string) {
    // Wait to allow the nodes learn about the new content
    await new Promise(resolve => setTimeout(resolve, UPLOAD_DELAY))

    // Request caching on the most popular gateway
    await Gateway.isStoredOnFirst(cid, false)
  },

  /**
   *
   *
   * @param {}
   * @param path
   */
  async rm({}, path: string) {
    if (!ipfs.api) {
      throw new Error('IPFS API undefined!')
    }

    await ipfs.api.files.rm(`/.dreamlink/${path}`, {
      recursive: true
    })
  }
})
