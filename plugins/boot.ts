import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import ThemeBaseMixin from '@opendreamnet/nuxtjs-base/mixins/BaseMixin'
import { isNil } from 'lodash'
import BaseMixin from '../mixins/BaseMixin'
import { bus } from '../modules/bus'
import { settings } from '../modules/settings'

Vue.mixin(Vue.extend(ThemeBaseMixin))
Vue.mixin(BaseMixin)

if (isNil(window['BigInt'])) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const JSBI = require('jsbi')
  // @ts-ignore
  window['BigInt'] = JSBI.BigInt
}

const plugin: Plugin = async(ctx, inject) => {
  inject('bus', bus)
  inject('settings', Vue.observable(settings))
}

export default plugin