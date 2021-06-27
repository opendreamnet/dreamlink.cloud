import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import ThemeBaseMixin from '@opendreamnet/nuxtjs-base/mixins/BaseMixin'
import BaseMixin from '../mixins/BaseMixin'
import { bus } from '../modules/bus'
import { settings } from '../modules/settings'

Vue.mixin(Vue.extend(ThemeBaseMixin))
Vue.mixin(BaseMixin)

const plugin: Plugin = async(ctx, inject) => {
  inject('bus', bus)

  inject('settings', Vue.observable(settings))
}

export default plugin