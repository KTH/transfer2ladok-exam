const express = require('express')
const expressHandlebars = require('express-handlebars')
const Router = require('express-promise-router')
const log = require('skog')
const path = require('path')
const bodyParser = require('body-parser')
const system = require('./middleware/system')
const { oauth1, oauth2 } = require('./middleware/oauth')('/export3 ')
const authorization = require('./middleware/authorization')
const {
  startPage,
  showForm,
  showTestForm,
  submitForm
} = require('./middleware/export-to-ladok')
const cuid = require('cuid')

const server = express()
server.set('views', __dirname + '/views')
server.engine('handlebars', expressHandlebars())
server.set('view engine', 'handlebars')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

server.use((req, res, next) => {
  log.child({ req_id: cuid() }, next)
})

const PROXY_PATH = process.env.PROXY_PATH || ''

// Define the router as map between routes and a set of middleware
const router = Router()

if (process.env.NODE_ENV === 'development') {
  const Bundler = require('parcel-bundler')

  const file = path.resolve(process.cwd(), 'client/index.js')
  const options = {}

  const bundler = new Bundler(file, options)
  router.use('/dist', bundler.middleware())
  router.get('/test', showTestForm)
} else {
  router.use('/dist', express.static(path.resolve(process.cwd(), 'dist')))
}
router.post('/export', startPage)
router.post('/export2', oauth1)
router.get('/export3', oauth2, authorization, showForm)
router.post('/export3', submitForm)

router.get('/_monitor', system.monitor)
router.get('/_about', system.about)

server.use(PROXY_PATH, router)
server.use(function catchAll (err, req, res, next) {
  log.error({ req, res, err })
  res.send('An error ocurred! :(')
})
module.exports = server
