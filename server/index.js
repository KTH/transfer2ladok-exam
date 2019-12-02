const express = require('express')
const expressHandlebars = require('express-handlebars')

const bodyParser = require('body-parser')
const system = require('./middleware/system')
const { oauth1, oauth2 } = require('./middleware/oauth')('/export2')
const authorization = require('./middleware/authorization')
const { showForm, submitForm } = require('./middleware/export-to-ladok')

const server = express()
server.set('views', __dirname + '/views')
server.engine('handlebars', expressHandlebars())
server.set('view engine', 'handlebars')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const PROXY_PATH = process.env.PROXY_PATH || ''

// Define the router as map between routes and a set of middleware
const router = express.Router()
router.post('/export', oauth1)
router.get('/export2', oauth2, authorization, showForm)
router.post('/export2', submitForm)

router.get('/_monitor', system.monitor)
router.get('/_about', system.about)

server.use(PROXY_PATH, router)
module.exports = server
