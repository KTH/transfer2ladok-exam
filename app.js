require('dotenv').config()
require('skog/bunyan').createLogger({
  name: 'lms-export-to-ladok-2',
  app: 'lms-export-to-ladok-2',
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

  if (process.env.NODE_ENV === 'development') {
    skog.info(
      'Test endpoint available here: http://localhost:%s%s%s?course_id=%s',
      process.env.PORT || 3001,
      process.env.PROXY_PATH || '',
      '/test',
      12295
    )
  }
})
