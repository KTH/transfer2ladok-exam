const log = require('skog')

async function isAllowedInCanvas (canvas, courseId) {
  // These are role IDs mapped to roles in Canvas.
  const EXAMINER = 10
  const TEACHER = 4

  const enrollments = await canvas
    .list(`/courses/${courseId}/enrollments`, { user_id: 'self' })
    .toArray()

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

async function isAllowedInLadok () {
  return true
}

module.exports = {
  isAllowedInCanvas,
  isAllowedInLadok
}
