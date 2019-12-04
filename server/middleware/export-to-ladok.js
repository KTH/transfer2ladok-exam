const {
  getCanvasAssignments,
  getLadokModules,
  sendGradesToLadok
} = require('../../lib')
const log = require('skog')

async function startPage (req, res) {
  if (!req.body || !req.body.custom_canvas_course_id) {
    throw new Error()
  }

  res.render('start', {
    next: `${process.env.PROXY_PATH}/export2`,
    custom_canvas_course_id: req.body.custom_canvas_course_id,
    layout: false
  })
}

async function showForm (req, res) {
  const canvasAssignments = await getCanvasAssignments(
    req.query.course_id,
    req.accessData.token
  )

  const ladokModules = await getLadokModules(
    req.query.course_id,
    req.accessData.token
  )

  res.render('form', {
    canvas: canvasAssignments,
    ladok: ladokModules,
    token: req.accessData.token,
    course_id: req.query.course_id,
    layout: false
  })
}

async function submitForm (req, res) {
  log.info(
    `Sending grades of course ${req.body.course_id} - assignment ${req.body.canvas_assignment} to Ladok Module ${req.body.ladok_module}`
  )
  await sendGradesToLadok(
    req.body.course_id,
    req.body.canvas_assignment,
    req.body.ladok_module,
    req.body.examination_date,
    req.body.access_token
  )
  res.render('feedback', { layout: false })
}

module.exports = {
  startPage,
  showForm,
  submitForm
}
