import React, { useState, useEffect } from 'react'

function App ({ courseId }) {
  async function fetchData () {
    const result = await window.fetch(`api/course-info?course_id=${courseId}`)
      .then(r => r.json())
    console.log(result)
  }

  const [assignments, setAssignments] = useState([1])

  useEffect(() => {
    fetchData()
  })

  return (
    <div>
      <select name='canvas_assignment'>
        {
          assignments.map(assignment => (
            <option key={assignment} value={assignment}>
              {assignment}
            </option>
          ))
        }
      </select>
      <select name='ladok_module'></select>
    </div>
  )
}

export default App
