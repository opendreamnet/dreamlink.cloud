import Vue from 'vue'
import dialogPolyfill from 'dialog-polyfill'

export default Vue.extend({
  mounted() {
    // For Firefox...
    dialogPolyfill.registerDialog(this.$el as HTMLDialogElement)
  },

  methods: {
    open() {
      (this.$el as HTMLDialogElement).showModal()
    },
    
    close() {
      (this.$el as HTMLDialogElement).close()
    },
  }
})