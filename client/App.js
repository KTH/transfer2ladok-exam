import React, { useState, useEffect } from 'react'

function useFetch (url) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function fetchData () {
    window
      .fetch(url)
      .then(r => {
        if (!r.ok) {
          throw new Error(r.statusText)
        }
        return r
      })
      .then(r => r.json())
      .then(body => {
        setData(body)
        setLoading(false)
      })
      .catch(r => {
        setError(r)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { loading, error, data }
}

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
    </div>
  )
}

export default App
