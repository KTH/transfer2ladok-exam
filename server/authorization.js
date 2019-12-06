const log = require('skog')
const isAllowed = require('../lib/is-allowed')
const { ClientError } = require('../lib/errors')

module.exports = async function authorization (req, res, next) {
  const accessData = req.accessData

  if (!accessData) {
    throw new Error('No access data found')
  }

  if (accessData.realUserId && accessData.userId === accessData.realUserId) {
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
        'You must have permissions to write results in Ladok to use this export.'
      )
    }
    const allowedIncanvas = await isAllowed.isAllowedInCanvas(
      accessData.token,
      req.query.course_id
    )

    if (!allowedIncanvas) {
      throw new ClientError(
        'not_allowed',
        'Only teachers etcetera can use this app.'
      )
    }
  } catch (err) {
    log.error('could not authorize user properly', err)
    return next(err)
  }

  next()
}
