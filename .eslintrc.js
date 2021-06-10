module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  globals: {
    __DEV__: true,
    __WECHAT__: true,
    __ALIPAY__: true,
    App: true,
    Page: true,
    getApp: true,
    Component: true,
    Behavior: true,
    wx: true,
    getCurrentPages: true
  },

  rules: {
    'no-unused-vars': 'off',
    camelcase: 'off'
  }
}
