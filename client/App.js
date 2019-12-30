import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import WizardResult from './WizardResult'
import { useFetch } from './react-hooks'
import WizardForm from './WizardForm'
import WizardConfirm from './WizardConfirm'

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

  let content = ''
  //TODO: This is an odd duck...
  if (currentPage === 0) {
    return (
      <h1 className='alert alert-success'>
        Export cancelled. You can safely leave this page and go wherever you
        want to.
      </h1>
    )
  } else if (currentPage === 1) {
    return (
      <WizardForm
        setCurrentPage={setCurrentPage}
        examinationDate={examinationDate}
        setExaminationDate={setExaminationDate}
        selectedModule={selectedModule}
        setModule={setModule}
        allModules={allModules}
        selectedAssignment={selectedAssignment}
        setAssignment={setAssignment}
        allAssignments={allAssignments}
      />
    )
  } else if (currentPage === 2) {
    return (
      <WizardConfirm
        setCurrentPage={setCurrentPage}
        selectedAssignment={selectedAssignment}
        selectedModule={selectedModule}
        examinationDate={examinationDate}
        courseId={courseId}
      />
    )
  } else if (currentPage === 3) {
    const body = {
      course_id: courseId,
      canvas_assignment: selectedAssignment.id,
      ladok_module: selectedModule.id,
      examination_date: examinationDate
    }
    return <WizardResult body={body} setCurrentPage={setCurrentPage} />
  }
}

export default hot(App)
