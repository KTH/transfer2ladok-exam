import React from 'react'

function FeedbackTable ({ data }) {
  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  const changed = data.filter(r => r.changed)

  return (
    <table border='1'>
      <caption>
        Grades of {changed.length}/{sortedList.length} students have been
        updated
      </caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grade in Ladok draft (utkast)</th>
          <th>Updated?</th>
        </tr>
      </thead>
      <tbody>
        {sortedList.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td>{row.ladokGrade}</td>
            <td>{row.changed ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FeedbackTable
