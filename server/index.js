const express = require('express')
const system = require('./middleware/system')

const server = express()
const PROXY_PATH = process.env.PROXY_PATH || ''

// Define the router as map between routes and a set of middleware
const router = express.Router()
router.post('/export', (req, res) => {
  res.send('Hello /export')
})

router.get('/export2', (req, res) => {
  res.send('Hello /export2')
})

router.get('/_monitor', system.monitor)
router.get('/_about', system.about)

server.use(PROXY_PATH, router)
module.exports = server
