const CanvasAPI = require('@kth/canvas-api')
const log = require('skog')

async function getAssignments (token, courseId) {
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)

  return canvas.list(`/courses/${courseId}/assignments`).toArray()
}

async function getCourse (token, courseId) {
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)
  const { body: course } = await canvas.get(`/courses/${courseId}`)

  return course
}

async function getSubmissions (token, courseId, assignmentId) {
  log.debug(
    `Getting submissions for course ${courseId} - assignment ${assignmentId}`
  )
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)
  const params = { student_ids: ['all'], include: ['user'] }
  return canvas
    .list(`courses/${courseId}/assignments/${assignmentId}/submissions`, params)
    .toArray()
}

async function getGrade (submissions, studentIntegrationId) {
  const submission = submissions
    .filter(s => s.grade)
    .find(s => s.user.integration_id === studentIntegrationId)

  return submission && submission.grade
}

module.exports = {
  getCourse,
  getAssignments,
  getSubmissions,
  getGrade
}
