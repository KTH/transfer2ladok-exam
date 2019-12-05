import React, { useState } from 'react'

function App ({ courseId }) {
  const [assignments, setAssignments] = useState([1])

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
