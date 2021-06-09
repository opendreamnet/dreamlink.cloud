module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@dreamnet/eslint-config-dreamnet-nuxtjs',
    'plugin:wdio/recommended'
  ],
  plugins: [
    'wdio'
  ],
  // add your custom rules here
  rules: {
    'vue/no-mutating-props': 'off'
  }
}
