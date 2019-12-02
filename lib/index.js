const CanvasAPI = require('@kth/canvas-api')
const got = require('got')
const { sendGradesToLadok } = require('./send-grades-to-ladok')

async function getCanvasAssignments (courseId, token) {
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)

  return canvas.list(`/courses/${courseId}/assignments`).toArray()
}

async function getLadokModules (courseId, token) {
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)
  const { body: course } = await canvas.get(`/courses/${courseId}`)

  const match = course.sis_course_id.match(/(.*)(VT|HT)(\d{2})\d/)

  if (!match) {
    return []
  }

  const [, courseCode, term, year] = match
  const courseDetails = await got(
    `https://api.kth.se/api/kopps/v2/course/${courseCode}/detailedinformation`
  ).json()

  const termUtils = {
    VT: 1,
    HT: 2
  }
  const termNumber = `20${year}${termUtils[term]}`
  const examinationSets = Object.values(courseDetails.examinationSets)
    .sort(
      (a, b) =>
        parseInt(a.startingTerm.term, 10) - parseInt(b.startingTerm.term, 10)
    )
    .filter(e => parseInt(e.startingTerm.term, 10) <= termNumber)

  const examinationRounds =
    examinationSets[examinationSets.length - 1].examinationRounds

  return examinationRounds.map(round => ({
    id: round.ladokUID,
    name: round.examCode,
    title: round.title
  }))
}

module.exports = {
  getCanvasAssignments,
  getLadokModules,
  sendGradesToLadok
}
