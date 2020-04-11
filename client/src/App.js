import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navbar from './components/Navbar'
import HomePage from './pages/Home'

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path='/' component={HomePage} />
      </Switch>
    </Router>
  )
}

export default App
