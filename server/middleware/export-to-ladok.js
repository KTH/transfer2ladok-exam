async function showForm (req, res) {
  const canvas = [
    { id: '1', name: 'Assignment 1' },
    { id: '2', name: 'Assignment 2' }
  ]

  const ladok = [
    { id: 'xxx', name: 'MOD1' },
    { id: 'xxx', name: 'MOD2' }
  ]
  res.render('form', { canvas, ladok, layout: false })
}

async function submitForm (req, res) {
  console.log(req.body)
  res.send('Hello form')
}

module.exports = {
  showForm,
  submitForm
}
