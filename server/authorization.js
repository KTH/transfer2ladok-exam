const log = require('skog')
const isAllowed = require('../lib/is-allowed')
const { ClientError } = require('../lib/errors')

async function authorize (req, res, next) {
  const accessData = req.accessData || req.signedCookies.access_data
  const courseId = req.query.course_id || req.body.course_id

  req.accessData = accessData

  if (!accessData) {
    throw new Error('No access data found')
  }

  if (accessData.realUserId && accessData.userId !== accessData.realUserId) {
    throw new ClientError(
      'not_allowed',
      'You are not allowed to use this app in Masquerade mode ("acting as" a different user)'
    )
  }

  try {
    const allowedInLadok = await isAllowed.isAllowedInLadok(accessData.token)
    if (!allowedInLadok) {
      throw new ClientError(
        'not_allowed',
        'You must have permissions to write results in Ladok to use this function. Contact ladok@kth.se if you need help.'
      )
    }
    const allowedIncanvas = await isAllowed.isAllowedInCanvas(
      accessData.token,
      courseId
    )

    if (!allowedIncanvas) {
      throw new ClientError(
        'not_allowed',
        'Only teachers and examiners are allowed to use this app. Contact it-support@kth.se if you need help.'
      )
    }
  } catch (err) {
    log.error('could not authorize user properly', err)
    return next(err)
  }

  next()
}

module.exports = {
  authorize
}
