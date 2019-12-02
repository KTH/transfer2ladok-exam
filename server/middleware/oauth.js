const skog = require('skog')
const querystring = require('querystring')
const { URL } = require('url')

class ClientError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.name = 'ClientError'
  }
}

function oauth1 (redirectPath) {
  return function oauth1Middleware (req, res, next) {
    if (!req.body) {
      skog.warn({ req }, 'Missing body in the request')
      return next(new ClientError('missing_body', ''))
    }

    if (!req.body.custom_canvas_course_id) {
      skog.warn({ req }, 'Body attribute "custom_canvas_course_id" missing')
      return next(new ClientError('missing_attribute', ''))
    }

    const callbackUrl = new URL(
      `${req.baseUrl}${redirectPath}`,
      process.env.PROXY_BASE
    )
    callbackUrl.search = querystring.stringify({
      course_id: req.body.custom_canvas_course_id
    })

    skog.info('Next URL will be %s', callbackUrl)

    const url = new URL('/login/oauth2/auth', process.env.CANVAS_HOST)
    url.search = querystring.stringify({
      client_id: process.env.CANVAS_CLIENT_ID,
      response_type: 'code',
      redirect_uri: callbackUrl.toString()
    })

    skog.info('Redirecting to %s...', url)

    res.redirect(url)
  }
}

async function oauth2 (req, res, next) {
  res.send('Hello back!')
}

module.exports = {
  oauth1,
  oauth2
}
