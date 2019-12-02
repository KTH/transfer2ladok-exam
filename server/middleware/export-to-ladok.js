const { getCanvasAssignments, getLadokModules } = require('../../lib')

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
    layout: false
  })
}

async function submitForm (req, res) {
  console.log(req.body)
  res.send('Hello form')
}

module.exports = {
  showForm,
  submitForm
}
