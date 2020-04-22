require('dotenv').config()
require('@kth/reqvars').check()
require('skog/bunyan').createLogger({
  name: 'lms-transfer2ladok-exam',
  app: 'lms-transfer2ladok-exam',
  serializers: require('bunyan').stdSerializers,
  level: process.env.LOG_LEVEL || 'info'
})
require('./lib/ladok/api').init()
require('./lib/mongo').init()

const skog = require('skog')
const server = require('./server')

server.listen(process.env.PORT || 3001, async () => {
  skog.info(
    'Server started. Go to http://localhost:%s',
    process.env.PORT || 3001
  )
})
