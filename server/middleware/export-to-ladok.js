const canvas = require('../../lib/canvas')

async function showForm (req, res) {
  const canvasAssignments = await canvas.getAssignments(
    req.query.course_id,
    req.accessData.token
  )

  const ladok = [
    { id: 'xxx', name: 'MOD1' },
    { id: 'xxx', name: 'MOD2' }
  ]
  res.render('form', { canvas: canvasAssignments, ladok, layout: false })
}

async function submitForm (req, res) {
  console.log(req.body)
  res.send('Hello form')
}

module.exports = {
  showForm,
  submitForm
}
