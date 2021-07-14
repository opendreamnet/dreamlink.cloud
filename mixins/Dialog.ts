import Vue from 'vue'
import dialogPolyfill from 'dialog-polyfill'
import { kebabCase } from 'lodash'

export default Vue.extend({
  computed: {
    shortName() {
      // @ts-ignore
      if (!this.$options._componentTag) {
        return null
      }

      // @ts-ignore
      return kebabCase(this.$options._componentTag.replace('Dialog', '').replace('Lazy', ''))
    }
  },

  mounted() {
    // For Firefox...
    dialogPolyfill.registerDialog(this.$el as HTMLDialogElement)

    if (this.shortName) {
      this.$events.on(`dialog.${this.shortName}.open`, this.open)
      this.$events.on(`dialog.${this.shortName}.close`, this.close)
    }
  },

  beforeDestroy() {
    if (this.shortName) {
      this.$events.off(`dialog.${this.shortName}.open`, this.open)
      this.$events.off(`dialog.${this.shortName}.close`, this.close)
    }
  },

  methods: {
    open() {
      (this.$el as HTMLDialogElement).showModal()
    },

    close() {
      (this.$el as HTMLDialogElement).close()
    }
  }
})