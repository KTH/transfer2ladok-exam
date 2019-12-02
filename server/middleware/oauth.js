const skog = require('skog')
const querystring = require('querystring')
const { URL } = require('url')
const got = require('got')

class ClientError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.name = 'ClientError'
  }
}

async function getAccessData (redirectUrl, code) {
  const body = await got({
    method: 'POST',
    url: `${process.env.CANVAS_HOST}/login/oauth2/token`,
    json: {
      grant_type: 'authorization_code',
      client_id: process.env.CANVAS_CLIENT_ID,
      client_secret: process.env.CANVAS_CLIENT_SECRET,
      redirect_url: redirectUrl,
      code: code,
      replace_tokens: true
    }
  }).json()

  return {
    token: body.access_token,
    userId: body.user.id,
    realUserId: body.real_user && body.real_user.id
  }
}

const oauth1 = redirectPath =>
  function oauth1Middleware (req, res, next) {
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

const oauth2 = redirectPath =>
  async function oauth2Middleware (req, res, next) {
    if (!req.query || !req.query.course_id) {
      return next(
        new ClientError(
          'missing_query_parameters',
          'Missing query parameter [course_id]'
        )
      )
    }

    if (req.query.error && req.query.error === 'access_denied') {
      return next(
        new ClientError(
          'access_denied',
          'The user has not authorized the app. Obtained query parameter [error=access_denied]'
        )
      )
    }

    if (req.query.error) {
      return next(
        new ClientError(
          'unknown_oauth_error',
          `Unexpected query parameter [error=${req.query.error}] received from Canvas`
        )
      )
    }

    if (!req.query.code) {
      return next(
        new ClientError(
          'access_denied',
          'The user has not authorized the app. Missing query parameter [code]'
        )
      )
    }

    let accessData
    try {
      const callbackUrl = new URL(
        `${req.baseUrl}${redirectPath}`,
        process.env.PROXY_BASE
      )

      accessData = await getAccessData(callbackUrl.toString(), req.query.code)
    } catch (err) {
      skog.error(err, 'Could not get access data from Canvas.')
      return next(err)
    }

    req.accessData = accessData
    next()
  }

module.exports = redirectPath => ({
  oauth1: oauth1(redirectPath),
  oauth2: oauth2(redirectPath)
})
