module.exports = {
  presets: [
    require('@opendreamnet/nuxtjs-base/tailwind.config')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ]
      },

      colors: {
        ipfs: {
          DEFAULT: '#65C2CB'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
