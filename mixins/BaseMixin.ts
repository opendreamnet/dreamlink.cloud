import Vue from 'vue'
import prettyBytes from 'pretty-bytes'

export default Vue.extend({
  filters: {
    prettyBytes(value?: number): string {
      if (!value) {
        return '?'
      }
      
      return prettyBytes(value)
    }
  }
})