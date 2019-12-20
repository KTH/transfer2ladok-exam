import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react'
import Table from './Table'
import { useFetch, useValidatedState } from './react-hooks'

function App({ courseId }) {
  const { loading, error, data } = useFetch(
    `api/course-info?course_id=${courseId}`
  )

  const [selectedAssignment, setAssignment] = useState(null)
  const [selectedModule, setModule] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  const allAssignments = [
    { id: 0, name: 'Choose an assignment in Canvas' }
  ].concat(data.canvasAssignments)

  const allModules = [{ id: 0, name: 'Choose a module in Ladok' }].concat(
    data.ladokModules
  )

  const showTable = selectedAssignment && selectedModule

  let content
  if (currentPage === 1) {
    content = <div className="form-group">
      <h1>Choose which assignment to Export, to which Ladok module (Step 1 of 2)</h1>
      <h2>Canvas assignment:</h2>
      <p>Note that only letter grades will be sent to Ladok</p>
      <select
        className="form-control"
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
      <p>To which Ladok module do you want the results to be exported?</p>
      <select
        className="form-control"
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
      <p>
        Required field. When exporting to Ladok, all students will receive the
        same Examination Date. If you need to set a different date individually,
        please change it in Ladok after exporting.
    </p>
      <input name='examination_date' className="form-control" type='date' required />

      <input type='hidden' name='course_id' value={courseId} />

      <h2>Click to export</h2>
      <button type='submit'>Export to Ladok</button>

      <h2>Here you can see the grades of the selected assignment/module</h2>
      {showTable && (
        <Table
          course={courseId}
          assignment={selectedAssignment}
          module={selectedModule}
        />
      )}
    </div>
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default hot(App)
// export default App
