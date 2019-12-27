import React from 'react'
import { useFetch } from './react-hooks'

function Table ({ course, assignment, module, date }) {
  const { loading, error, data } = useFetch(
    `api/table?course_id=${course}&assignment_id=${assignment.id}&module_id=${module.id}`
  )

  if (loading) return <div className='loader'>Loading...</div>

  if (error) return <div>error</div>

  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  return (
    <>
      <p>
        <span className='font-weight-bold'>Selected examination date:</span>{' '}
        {date}
      </p>
      <table border='1'>
        <caption>Number of students: {sortedList.length}</caption>
        <thead>
          <tr>
            <th>Student</th>
            <th>Canvas: {assignment.name}</th>
            <th>Ladok: {module.name}</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.canvasGrade}</td>
              <td>{row.ladokGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Table
