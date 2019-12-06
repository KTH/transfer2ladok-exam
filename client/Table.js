import React from 'react'
import { useFetch } from './react-hooks'

function Table ({ course, assignment, module }) {
  const { loading, error, data } = useFetch(
    `api/table?course_id=${course}&assignment_id=${assignment}&module_id=${module}`
  )

  if (loading) return <div>Loading</div>

  if (error) return <div>error</div>

  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  return (
    <table border='1'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Canvas grade</th>
          <th>Ladok grade</th>
        </tr>
      </thead>
      <tbody>
        {sortedList.map(row => (
          <tr>
            <td>{row.name}</td>
            <td>{row.canvasGrade}</td>
            <td>{row.ladokGrade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
