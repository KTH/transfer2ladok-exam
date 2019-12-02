require('dotenv').config()
require('skog/bunyan').createLogger({
  name: 'lms-export-to-ladok-2',
  app: 'lms-export-to-ladok-2',
  serializers: require('bunyan').stdSerializers
})
require('./lib/ladok-api').init()

const skog = require('skog')
const server = require('./server')

server.listen(process.env.PORT || 3001, async () => {
  skog.info(
    'Server started. Go to http://localhost:%s',
    process.env.PORT || 3001
  )
})
