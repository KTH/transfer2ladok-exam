const canvas = require('./canvas')
const kopps = require('./kopps')
const ladok = require('./ladok')
const log = require('skog')

/** Get the assignments of a course in Canvas */
async function getCanvasAssignments (courseId, token) {
  return canvas.getAssignments(token, courseId)
}

/** Get the Ladok modules of a course in Canvas */
async function getLadokModules (courseId, token) {
  const course = await canvas.getCourse(token, courseId)
  const match = course.sis_course_id.match(/(.*)(VT|HT)(\d{2})\d/)

  if (!match) {
    return []
  }

  const [, courseCode, term, year] = match
  return kopps.getModules(courseCode, year, term)
}

/** Send grades of a canvas course to a ladok module */
async function sendGradesToLadok (
  courseId,
  assignmentId,
  moduleId,
  examinationDate,
  token
) {
  log.debug('Sending grades to Ladok...')
  const course = await canvas.getCourse(token, courseId)

  const gradeableResults = await ladok.listGradeableResults(
    course.integration_id,
    moduleId
  )
  log.debug(`Found ${gradeableResults.length} gradeable results`)

  const draft = ladok.createDraft(moduleId)
  const submissions = await canvas.getSubmissions(token, courseId, assignmentId)

  for (const result of gradeableResults) {
    const grade = await canvas.getGrade(submissions, result.Student.Uid)
    await draft.setGrade(result, grade, examinationDate)
  }

  log.info('Draft created. Sending to Ladok...')
  await ladok.sendDraft(draft)
}

module.exports = {
  getCanvasAssignments,
  getLadokModules,
  sendGradesToLadok
}
