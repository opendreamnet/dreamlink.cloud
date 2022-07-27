module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/valid-attribute-name': 0,
    'vue/valid-model-definition': 0,
    'space-before-function-paren': ['error', 'never'],
    'import/named': 'off',
    'vue/html-closing-bracket-newline': ['warn', {
      singleline: 'never',
      multiline: 'never'
    }]
  }
}
