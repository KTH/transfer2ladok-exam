import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import Table from './Table'
import { useFetch, useValidatedState } from './react-hooks'

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
    title = 'Choose an assignment in Canvas first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  } else if (!selectedModule) {
    disabled = true
    title = 'Choose a module in Ladok first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  } else if (!examinationDate) {
    disabled = true
    title = 'Choose an examination date first'
    buttonClassNames = buttonClassNames.concat(' ', 'disabled')
  }

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

  const content0 = (
    <h1 className='alert alert-success'>
      Export cancelled. You can safely leave this page and go wherever you want
      to.
    </h1>
  )

  const content1 = (
    <div className='form-group'>
      <h1>
        Choose which assignment to Export, to which Ladok module (Step 1 of 2)
      </h1>
      <h2>Canvas assignment</h2>
      <p>Note that only letter grades will be sent to Ladok</p>
      <div className='select-wrapper'>
        <select
          className='custom-select'
          value={selectedAssignment || ''}
          name='canvas_assignment'
          onChange={event => setAssignment(event.target.value)}
        >
          <option value='' disabled hidden>
            Choose assignment
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
          value={selectedModule || ''}
          onChange={event => setModule(event.target.value)}
        >
          <option value='' disabled hidden>
            Choose Ladok module
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
        same Examination Date. If you need to set a different date individually,
        please change it in Ladok after exporting.
      </p>
      <input
        name='examination_date '
        className='form-control'
        type='date'
        value={examinationDate}
        onChange={event => setExaminationDate(event.target.value)}
        required
      />
      <input type='hidden' name='course_id' value={courseId} />
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
      <button type='submit' className='btn btn-success grid-col-3'>
        Export to Ladok
      </button>
    </div>
  )
  const content2 = (
    <div className='form-group'>
      <input type='hidden' name='course_id' value={courseId} />
      <h2>Here you can see the grades of the selected assignment/module</h2>
      {showTable && (
        <div>
          <Table
            course={courseId}
            assignment={selectedAssignment}
            module={selectedModule}
          />
          {tableFooter}
        </div>
      )}
    </div>
  )

  let content = ''
  if (currentPage === 0) {
    content = content0
  } else if (currentPage === 1) {
    content = content1
  } else if (currentPage === 2) {
    content = content2
  }

  return <div>{content}</div>
}

export default hot(App)
