const Canvas = require('@kth/canvas-api')
module.exports = Canvas(
  `${process.env.CANVAS_HOST}/api/v1`,
  process.env.CANVAS_ADMIN_API_TOKEN
)
