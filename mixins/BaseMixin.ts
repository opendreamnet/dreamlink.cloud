import Vue from 'vue'
import prettyBytes from 'pretty-bytes'
import { DateTime } from 'luxon'

export default Vue.extend({
  filters: {
    prettyBytes(value?: number): string {
      if (!value) {
        return '?'
      }
      
      return prettyBytes(value)
    },

    toRelative(value: string): string {
      return DateTime.fromISO(value).toRelative() || 'Unknown'
    }
  }
})