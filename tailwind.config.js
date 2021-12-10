module.exports = {
  presets: [
    require('@opendreamnet/nuxtjs-base/tailwind.config')
  ],
  theme: {
    extend: {
      colors: {
        ipfs: {
          DEFAULT: '#65C2CB'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/line-clamp')
  ]
}