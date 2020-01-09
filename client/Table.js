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

  let gradesToExport = 0
  for (const student of sortedList) {
    student.exportGrade =
      student.ladokGrade.existsInLadok &&
      student.canvasGrade &&
      student.canvasGrade !== student.ladokGrade.letter
    if (student.exportGrade) {
      gradesToExport++
    }
  }

  return (
    <>
      <p>
        <span className='font-weight-bold'>Selected examination date:</span>{' '}
        {date}
      </p>
      <div className='table-container'>
        <table border='1'>
          <caption>
            Can export {gradesToExport}/{sortedList.length} grades:
          </caption>
          <thead>
            <tr>
              <th>Student</th>
              <th>Canvas: {assignment.name}</th>
              <th>Export to Ladok?</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((row, i) => (
              <tr
                key={i}
                className={
                  row.exportGrade ? 'do-export-row' : 'dont-export-row'
                }
              >
                <td>{row.name}</td>
                <td>{row.canvasGrade}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Table
