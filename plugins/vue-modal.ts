import Vue from 'vue'
import VModal from 'vue-js-modal'

Vue.use(VModal, {
  dynamicDefaults: {
    adaptive: true,
    scrollable: true,
    focusTrap: true,
    clickToClose: false,
    height: 'auto'
  }
})
