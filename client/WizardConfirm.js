import React from 'react'
import Table from './Table'

function WizardConfirm ({
  setCurrentPage,
  selectedAssignment,
  selectedModule,
  examinationDate,
  courseId
}) {
  const showTable = selectedAssignment && selectedModule

  const tableFooter = (
    <div className='button-section'>
      <button
        type='button'
        className='btn btn-secondary grid-col-1'
        onClick={event => setCurrentPage(1)}
      >
        ← Assignments and Date
      </button>
      <button
        type='button'
        className='btn btn-secondary grid-col-2'
        onClick={event => setCurrentPage(0)}
      >
        Cancel
      </button>
      <button
        className='btn btn-primary grid-col-3'
        onClick={evt => {
          if (
            window.confirm(
              `
              You are about to export results for:
              Canvas assignment:${selectedAssignment.name}
              Ladok module: ${selectedModule.name}
              Examination Date: ${examinationDate}
              
              Do you want to proceed?`
            )
          ) {
            setCurrentPage(3)
          } else {
            setCurrentPage(1)
          }
        }}
      >
        Export to Ladok
      </button>
    </div>
  )

  return (
    <form>
      <h2>Export students with results (Step 2 of 2)</h2>
      <div className='alert alert-info' aria-live='polite' role='alert'>
        <p>
          Note that the results of students are based on data fetched from
          Canvas Gradebook during launch of this application. If you have
          entered a result very recently and it is missing, you might have to
          relaunch the application.
        </p>
      </div>
      {showTable && (
        <Table
          course={courseId}
          assignment={selectedAssignment}
          module={selectedModule}
          date={examinationDate}
        />
      )}
      {showTable && tableFooter}
    </form>
  )
}

export default WizardConfirm
