const presets = [
  [
    '@babel/env',
    {
      useBuiltIns: 'usage',
      corejs: '3'
    }
  ],
  ['@babel/react']
]

module.exports = { presets }