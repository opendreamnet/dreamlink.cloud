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
  ],
  // add your custom rules here
  rules: {
    'vue/no-mutating-props': 'off',
    'vue/no-v-html': 'off',

    '@typescript-eslint/no-explicit-any': 'off',

    'no-console': 'off',

    'vue/max-attributes-per-line': ['warn', {
      singleline: {
        max: 3,
        allowFirstLine: true
      },
      multiline: {
        max: 1,
        allowFirstLine: true
      }
    }]
  }
}
