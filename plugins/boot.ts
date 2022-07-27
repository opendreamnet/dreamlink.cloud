import Vue from 'vue'
import type { Plugin } from '@nuxt/types'
import ThemeBaseMixin from '@opendreamnet/nuxtjs-base/mixins/BaseMixin'
import { isNil } from 'lodash'
import BaseMixin from '../mixins/BaseMixin'
import { events } from '../modules/bus'

// Base Mixins
Vue.mixin(Vue.extend(ThemeBaseMixin))
Vue.mixin(BaseMixin)

// BigInt polyfill for Safari and other browsers.
if (isNil(window.BigInt)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const JSBI = require('jsbi')
  window.BigInt = JSBI.BigInt
}

const plugin: Plugin = (ctx, inject) => {
  inject('events', events)
}

export default plugin
