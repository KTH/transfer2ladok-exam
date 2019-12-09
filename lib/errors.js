class ExportError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.name = 'ExportError'
  }
}

class ClientError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.name = 'ClientError'
  }
}

module.exports = {
  ExportError,
  ClientError
}
