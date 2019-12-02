async function showForm (req, res) {
  res.send('Hello World')
}

async function submitForm (req, res) {
  res.send('Hello form')
}

module.exports = {
  showForm,
  submitForm
}
