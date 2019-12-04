const log = require('skog')
const ladok = require('./ladok')
const canvas = require('./canvas')
const canvasAdmin = require('./canvas-admin')

async function isAllowedInCanvas (token, courseId) {
  // These are role IDs mapped to roles in Canvas.
  const EXAMINER = 10
  const TEACHER = 4

  const enrollments = await canvas.getSelfEnrollments(token, courseId)

  const allowedRoles = enrollments
    .map(enrollment => parseInt(enrollment.role_id, 10))
    .filter(role => role === EXAMINER || role === TEACHER)

  log.info(`The user has the roles: ${allowedRoles}`)

  if (allowedRoles.length === 0) {
    log.info(
      'The user is not allowed in Canvas. Only teachers and similar roles can use this app.'
    )
    return false
  }

  return true
}

async function isAllowedInLadok (token) {
  const currentUser = await canvas.getSelf(token)
  log.info('currentUser', currentUser)

  // get more information about the user that clicked the button
  const {
    body: { login_id: loginId }
  } = await canvasAdmin.get(`/users/${currentUser.id}`)
  log.info('login_id for currentUser:', loginId)

  const reporters = await ladok.listReporters()
  const ladokReporter = reporters[loginId]
  if (ladokReporter) {
    log.info('The user is one of the result reporters in Ladok', ladokReporter)
    return true
  } else {
    log.warn(
      'Could not find this user among the ladok reporters in Ladok. The user is probably missing the profile in Ladok, and is not allowed to run the report'
    )
    return false
  }
}

async function isAllowed () {
  return true
}

module.exports = {
  isAllowedInCanvas,
  isAllowedInLadok,
  isAllowed
}
