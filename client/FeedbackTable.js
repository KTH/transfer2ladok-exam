import React from 'react'

function FeedbackTable ({ data }) {
  const sortedList = data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))

  const changed = sortedList.filter(r => r.newGrade)

  return (
    <table border='1'>
      <caption>
        <p>
          Grades of {changed.length}/{sortedList.length} students have been
          updated:
        </p>
      </caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>New grade in Ladok draft (utkast)</th>
        </tr>
      </thead>
      <tbody>
        {changed.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td>{row.newGrade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FeedbackTable
