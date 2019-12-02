const express = require('express')
const bodyParser = require('body-parser')
const system = require('./middleware/system')
const { oauth1, oauth2 } = require('./middleware/oauth')

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const PROXY_PATH = process.env.PROXY_PATH || ''

// Define the router as map between routes and a set of middleware
const router = express.Router()
router.post('/export', oauth1('/export2'))
router.get('/export2', oauth2, (req, res) => {
  res.send('Hello back!')
})

router.get('/_monitor', system.monitor)
router.get('/_about', system.about)

server.use(PROXY_PATH, router)
module.exports = server
