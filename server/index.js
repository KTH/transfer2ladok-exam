const server = require('express')()
const PROXY_PATH = process.env.PROXY_PATH || ''

server.post(PROXY_PATH + '/export', (req, res) => {
  res.send('Hello /export')
})

server.get(PROXY_PATH + '/export2', (req, res) => {
  res.send('Hello /export2')
})

module.exports = server
