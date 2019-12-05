import '@babel/polyfill'
import React from 'react'
import App from './App'
import { render } from 'react-dom'

render(<App courseId={window.__COURSE_ID__} />, document.getElementById('root'))
