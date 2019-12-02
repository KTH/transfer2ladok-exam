async function showForm (req, res) {
  res.render('form', { layout: false })
}

async function submitForm (req, res) {
  res.send('Hello form')
}

module.exports = {
  showForm,
  submitForm
}
