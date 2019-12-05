import React, { useState, useEffect } from 'react'

function useFetch (url) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function fetchData () {
    window.fetch(url)
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

  return {loading, error, data}
}

function App ({ courseId }) {
  const {loading, error, data } = useFetch(`api/course-info?course_id=${courseId}`)

  if (loading) return (
    <div>Loading...</div>
  )

  if (error) return (
    <div>Error</div>
  )

  return (
    <div>
      <select name='canvas_assignment'>
        {
          data.canvasAssignments.map(assignment => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.name}
            </option>
          ))
        }
      </select>
      <select name='ladok_module'></select>
    </div>
  )
}

export default App
