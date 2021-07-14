import Vue from 'vue'
import prettyBytes from 'pretty-bytes'
import ClipboardJS from 'clipboard'
import tippy from 'tippy.js'
import { DateTime } from 'luxon'

export default Vue.extend({
  directives: {
    clipboard: {
      inserted: (el, binding) => {
        const dialog = el.closest('dialog')

        const options: ClipboardJS.Options = {
          text: () => binding.value
        }

        if (dialog) {
          options.container = dialog
        }

        const clipboard = new ClipboardJS(el, options)

        const tooltip = tippy(el, {
          content: 'Copied!',
          appendTo: 'parent',
          trigger: 'manual'
        })

        clipboard.on('success', () => {
          tooltip.show()

          setTimeout(() => {
            tooltip.hide()
          }, 2000)
        })
      }
    }
  },

  filters: {
    prettyBytes(value?: number): string {
      if (!value) {
        return '?'
      }

      return prettyBytes(value)
    },

    toRelative(value: string): string {
      return DateTime.fromISO(value).toRelative() || 'Unknown'
    },

    dateToLocale(value?: string): string {
      return value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY) : 'Unknown'
    },

    dateFormat(value: DateTime): string {
      return `${value.toRelativeCalendar({ unit: 'days' })} at ${value.toFormat('hh:mm a')}`
    }
  }
})