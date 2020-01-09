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

  const tableData = { transferableGrades: 0, students: [] }
  for (const student of sortedList) {
    const isTransferable =
      student.ladokGradeData.existsAsDraft &&
      student.canvasGrade &&
      student.canvasGrade !== student.ladokGradeData.letter
    tableData.students.push({ student, isTransferable })
    if (isTransferable) {
      tableData.transferableGrades++
    }
  }

  return (
    <>
      <p>
        <span className='font-weight-bold'>From:</span> {assignment.name}
        <br />
        <span className='font-weight-bold'>To:</span> {module.name}
        <br />
        <span className='font-weight-bold'>
          Selected examination date:
        </span>{' '}
        {date}
      </p>
      <div className='table-container'>
        <table border='1'>
          <caption>
            Can export {tableData.transferableGrades}/
            {tableData.students.length} grades:
          </caption>
          <thead>
            <tr>
              <th className='table-col-1'>Student</th>
              <th className='table-col-2'>Canvas grade</th>
              <th className='table-col-3'>Transferable</th>
            </tr>
          </thead>
          <tbody>
            {tableData.students.map((row, i) => (
              <tr key={i} className={row.isTransferable ? 'do-export-row' : ''}>
                <td className='table-col-1'>{row.student.name}</td>
                <td className='table-col-2'>{row.student.canvasGrade}</td>
                <td className='table-col-3'>
                  {row.isTransferable ? 'Yes' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Table
