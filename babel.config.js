module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        loose: process.env.NODE_ENV === 'production'
      }
    ]
  ],
  plugins: ['transform-vue-jsx']
}
