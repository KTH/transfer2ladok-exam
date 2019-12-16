import React from 'react'

function FeedbackTable ({ data }) {
  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  const changed = data.filter(r => r.newGrade)

  return (
    <table border='1'>
      <caption>
        <p>
          Grades of {changed.length}/{sortedList.length} students have been
          updated
        </p>
      </caption>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedList.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td>{row.newGrade}</td>
            <td>{row.newGrade ? 'Has been updated' : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FeedbackTable
