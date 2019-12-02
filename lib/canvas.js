const CanvasAPI = require('@kth/canvas-api')

async function getAssignments (courseId, token) {
  const canvas = CanvasAPI(`${process.env.CANVAS_HOST}/api/v1`, token)

  return canvas.list(`/courses/${courseId}/assignments`).toArray()
}

module.exports = {
  getAssignments
}
