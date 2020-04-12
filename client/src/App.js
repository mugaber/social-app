import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store, persistor } from './redux'
import { PersistGate } from 'redux-persist/integration/react'

import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Navbar from './components/Navbar'

import { loadUser } from './redux/auth/actions'

//

function App() {
  // useEffect(() => {
  //   store.dispatch(loadUser())
  // }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
          <Navbar />

          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/signup' component={SignupPage} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
