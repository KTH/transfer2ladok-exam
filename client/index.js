import React from 'react'
import { render } from 'react-dom'

console.log(window.__COURSE_ID__)
const App = () => <div>Hello from with hot loader</div>

render(<App />, document.getElementById('root'))
