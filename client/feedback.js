import React from 'react'
import { render } from 'react-dom'
import FeedbackTable from './FeedbackTable'

render(
  <FeedbackTable data={window.__DATA__} />,
  document.getElementById('root')
)
