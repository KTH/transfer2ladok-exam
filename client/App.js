import React, { useState } from 'react'
import Table from './Table'
import { useFetch } from './react-hooks'

function App ({ courseId }) {
  const { loading, error, data } = useFetch(
    `api/course-info?course_id=${courseId}`
  )

  const [selectedAssignment, setAssignment] = useState(null)
  const [selectedModule, setModule] = useState(null)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  const allAssignments = [
    { id: 0, name: 'Choose an assignment in Canvas' }
  ].concat(data.canvasAssignments)

  const allModules = [{ id: 0, name: 'Choose a module in Ladok' }].concat(
    data.ladokModules
  )

  const showTable = selectedAssignment && selectedModule

  return (
    <div>
      <h2>Canvas assignment</h2>
      <select
        name='canvas_assignment'
        onChange={event => setAssignment(event.target.value)}
      >
        {allAssignments.map(assignment => (
          <option key={assignment.id} value={assignment.id}>
            {assignment.name}
          </option>
        ))}
      </select>
      <h2>Ladok Module</h2>
      <select
        name='ladok_module'
        onChange={event => setModule(event.target.value)}
      >
        {allModules.map(ladokModule => (
          <option key={ladokModule.id} value={ladokModule.id}>
            {ladokModule.name} - {ladokModule.title}
          </option>
        ))}
      </select>
      <h2>Examination Date</h2>
      <input name='examination_date' type='date' />

      {
        showTable && <Table course={courseId} assignment={selectedAssignment} module={selectedModule} />
      }

    </div>
  )
}

export default App
