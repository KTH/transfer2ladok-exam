import React from 'react'
import { useFetch } from './react-hooks'

function WizardResult ({
  courseId,
  selectedAssignment,
  selectedModule,
  examinationDate,
  setCurrentPage
}) {
  const body = {
    course_id: courseId,
    canvas_assignment: selectedAssignment.id,
    ladok_module: selectedModule.id,
    examination_date: examinationDate
  }
  const { loading, error, data } = useFetch(`api/submitGrades`, 'POST', body)

  if (loading) return <div className='loader'>Loading...</div>

  if (error) {
    return (
      <>
        <div className='alert alert-danger' aria-live='polite' role='alert'>
          <h2>An error occurred during export.</h2>
          <p>
            No results were exported.
            <br />
            From: <strong>{selectedAssignment.name}</strong>
            <br />
            To: <strong>{selectedModule.name}</strong>
            <br />
            Examination date: <strong>{examinationDate}</strong>
          </p>
        </div>
        <div className='button-section'>
          <button
            className='btn btn-success grid-col-3'
            onClick={event => setCurrentPage(1)}
          >
            Done
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='alert alert-success' role='alert'>
        <h2>The export was successful.</h2>
        <p>
          {data.newLadokGrades.length} results have been exported.
          <br />
          From: <strong>{selectedAssignment.name}</strong>
          <br />
          To: <strong>{selectedModule.name}</strong>
          <br />
          Examination date: <strong>{examinationDate}</strong>
        </p>
      </div>
      <h2>Mark as ready in Ladok</h2>
      <p>
        The grading process continues in Ladok where you can now mark the
        exported grades as ready. Here is a{' '}
        <a href={data.ladokLink} target='_blank' rel='noreferrer noopener'>
          link
        </a>{' '}
        to the relevant module in Ladok. Note that you might have to click the
        link twice if you are prompted to log in to Ladok the first time.
      </p>
      <div className='button-section'>
        <button
          className='btn btn-success grid-col-3'
          onClick={event => setCurrentPage(1)}
        >
          Done
        </button>
      </div>
    </>
  )
}

export default WizardResult
