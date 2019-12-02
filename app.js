require('dotenv').config()
require('skog/bunyan').createLogger({
  name: 'lms-export-to-ladok-2',
  app: 'lms-export-to-ladok-2'
})

const skog = require('skog')

const server = require('express')()
server.listen(process.env.PORT || 3000, () => {
  skog.info('Server started. Go to http://localhost:%s', process.env.PORT || 3000)
})
