import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import Table from './Table'
import WizardResult from './WizardResult'
import { useFetch } from './react-hooks'
import { ButtonModal } from '@kth/kth-style-react-components'

function App ({ courseId }) {
  const { loading, error, data } = useFetch(
    `api/course-info?course_id=${courseId}`
  )

  const [selectedAssignment, setAssignment] = useState(null)
  const [selectedModule, setModule] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [examinationDate, setExaminationDate] = useState('')

  if (loading) return <div className='loader'>Loading...</div>
  if (error) return <div>Error</div>

  const allAssignments = [].concat(data.canvasAssignments)

  const allModules = [].concat(data.ladokModules)

  const showTable = selectedAssignment && selectedModule

  let disabled = false
  let title = ''
  let buttonClassNames = 'btn btn-success grid-col-3'
  if (!selectedAssignment) {
    disabled = true
    title = 'Select an assignment in Canvas first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  } else if (!selectedModule) {
    disabled = true
    title = 'Select a module in Ladok first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  } else if (!examinationDate) {
    disabled = true
    title = 'Select an examination date first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  }

  let content = ''
  //TODO: This is an odd duck...
  if (currentPage === 0) {
    content = (
      <h1 className='alert alert-success'>
        Export cancelled. You can safely leave this page and go wherever you
        want to.
      </h1>
    )
  } else if (currentPage === 1) {
    const nextButton = (
      <button
        className={buttonClassNames}
        disabled={disabled}
        title={title}
        onClick={event => setCurrentPage(2)}
      >
        Students →
      </button>
    )

    content = (
      <div className='form-group'>
        <h1>Select assignment and date (Step 1 of 2)</h1>
        <h2>Canvas assignment</h2>
        <p>Note that only letter grades will be sent to Ladok</p>
        <div className='select-wrapper'>
          <select
            className='custom-select'
            value={(selectedAssignment && selectedAssignment.id) || ''}
            name='canvas_assignment'
            onChange={event =>
              setAssignment({
                id: event.target.value,
                name: event.target.selectedOptions[0].text
              })
            }
          >
            <option value='' disabled hidden>
              Select assignment
            </option>
            {allAssignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.name}
              </option>
            ))}
          </select>
        </div>
        <h2>Ladok Module</h2>
        <p>To which Ladok module do you want the results to be exported?</p>
        <div className='select-wrapper'>
          <select
            className='custom-select'
            name='ladok_module'
            value={(selectedModule && selectedModule.id) || ''}
            onChange={event =>
              setModule({
                id: event.target.value,
                name: event.target.selectedOptions[0].text
              })
            }
          >
            <option value='' disabled hidden>
              Select Ladok module
            </option>
            {allModules.map(ladokModule => (
              <option key={ladokModule.id} value={ladokModule.id}>
                {ladokModule.name} - {ladokModule.title}
              </option>
            ))}
          </select>
        </div>
        <h2>Examination Date</h2>
        <p>
          Required field. When exporting to Ladok, all students will receive the
          same Examination Date. If you need to set a different date
          individually, please change it in Ladok after exporting.
        </p>
        <input
          name='examination_date '
          className='form-control'
          type='date'
          value={examinationDate}
          onChange={event => setExaminationDate(event.target.value)}
          required
        />
        <div className='button-section'>
          <button
            className='btn btn-secondary grid-col-2'
            onClick={event => setCurrentPage(0)}
          >
            Cancel
          </button>
          {nextButton}
        </div>
      </div>
    )
  } else if (currentPage === 2) {
    const tableFooter = (
      <div className='button-section'>
        <button
          type='button'
          className='btn btn-secondary grid-col-1'
          onClick={event => setCurrentPage(1)}
        >
          ← Assignments
        </button>
        <button
          type='button'
          className='btn btn-secondary grid-col-2'
          onClick={event => setCurrentPage(0)}
        >
          Cancel
        </button>
        <ButtonModal
          id='export'
          type='submit'
          btnLabel='Export to Ladok'
          handleParentConfirm={() => {
            setCurrentPage(3)
          }}
          modalLabels={{
            header: 'Confirm export',
            body: `<br>Canvas assignment: <strong>${selectedAssignment.name}</strong><br>Ladok module: <strong>${selectedModule.name}</strong><br>Date: <strong>${examinationDate}</strong><br><br>Do you want to proceed?`,
            btnCancel: 'No, go back',
            btnConfirm: 'Yes, export'
          }}
          className='grid-col-3'
          disabled={false}
        />
      </div>
    )

    content = (
      <div className='form-group'>
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
          <div>
            <Table
              course={courseId}
              assignment={selectedAssignment}
              module={selectedModule}
              date={examinationDate}
            />
            {tableFooter}
          </div>
        )}
      </div>
    )
  } else if (currentPage === 3) {
    const body = {
      course_id: courseId,
      canvas_assignment: selectedAssignment.id,
      ladok_module: selectedModule.id,
      examination_date: examinationDate
    }
    content = (
      <>
        <WizardResult body={body} />
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

  return <div>{content}</div>
}

export default hot(App)
