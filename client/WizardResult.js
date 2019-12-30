import React from 'react'
import { useFetch } from './react-hooks'

function WizardResult ({ body }) {
  const { loading, error, data } = useFetch(`api/submitData`, 'POST', body)

  if (loading) return <div className='loader'>Loading...</div>

  if (error) return <div>error</div>

  return <p>Huzzah!</p>
}

export default WizardResult

//<div className='alert alert-success' role='alert'>
//<p>The export has been processed with the following outcome:</p>
//</div>
