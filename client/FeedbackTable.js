import React from 'react'

function FeedbackTable ({ data }) {
  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  const changed = data.filter(r => r.changed)
  const failed = data.filter(r => r.failed)

  return (
    <table border='1'>
      <caption>
        <p>
          Grades of {changed.length}/{sortedList.length} students have been
          updated
        </p>
        {failed.length > 0 && (
          <p>{failed.length} grades were not submitted successfully to Ladok</p>
        )}
      </caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grade in Ladok draft (utkast)</th>
          <th>Updated?</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedList.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td>{row.ladokGrade}</td>
            <td>{row.changed ? 'Yes' : 'No'}</td>
            <td>{row.failed && 'Could not export to Ladok'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FeedbackTable
