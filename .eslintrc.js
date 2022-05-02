module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@dreamnet/eslint-config-dreamnet-nuxtjs'
  ],
  plugins: [
    'jest',
    'unicorn'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/no-mutating-props': 'off'
  }
}
