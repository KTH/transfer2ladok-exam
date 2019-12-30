import React from 'react'
import { useFetch } from './react-hooks'

function WizardResult ({ body }) {
  const { loading, error, data } = useFetch(`api/submitGrades`, 'POST', body)

  if (loading) return <div className='loader'>Loading...</div>

  if (error) {
    return (
      <div className='alert alert-danger' aria-live='polite' role='alert'>
        <p>The export experienced an error.</p>
      </div>
    )
  }

  return (
    <>
      <div className='alert alert-success' role='alert'>
        <p>The export was successful.</p>
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
    </>
  )
}

export default WizardResult
