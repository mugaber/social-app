import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signupUser } from '../../redux/auth/actions'

import SignupGrid from './styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

//

const SignupPage = ({ history, signupUser, isAuthenticated }) => {
  const [state, setState] = useState({
    email: '',
    handle: '',
    password: '',
    confirmPass: '',
    loading: false,
  })

  const { email, handle, password, confirmPass, loading } = state

  const [error, setError] = useState({})

  const handleChange = (event) => {
    const name = event.target.name

    if (error[name]) setError({})

    setState({ ...state, [name]: event.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPass) return alert('Passwords must match')

    setState({ ...state, loading: true })

    try {
      const response = await signupUser({ email, handle, password })

      setSignupFail(true)

      //  signup success
      if (response === 'success') return

      const error = (response.data && response.data) || { general: 'Signup Failure' }
      setError(error)

      //
    } catch (err) {
      // not a server error
      console.log(err)
    }

    setState({ ...state, loading: false })
  }

  const [signupFail, setSignupFail] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSignupFail(false)
  }

  if (isAuthenticated) {
    history.push('/')
    return null
  }

  return (
    <SignupGrid container>
      <Grid item xs={12} sm={8} md={6} lg={5} className='form-grid'>
        <Typography variant='h2'>SignUp</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            id='email'
            name='email'
            type='email'
            label='Email'
            value={email}
            variant='outlined'
            onChange={handleChange}
            helperText={error.email}
            error={error.email ? true : false}
          />

          <TextField
            required
            fullWidth
            id='password'
            name='password'
            type='password'
            label='Password'
            value={password}
            onChange={handleChange}
            variant='outlined'
            helperText={error.password}
            error={error.password ? true : false}
          />

          <TextField
            required
            fullWidth
            type='password'
            id='confirmPass'
            name='confirmPass'
            variant='outlined'
            value={confirmPass}
            onChange={handleChange}
            label='Confirm Password'
            helperText={error.password}
            error={error.password ? true : false}
          />

          <TextField
            required
            fullWidth
            id='handle'
            type='text'
            name='handle'
            label='Handle'
            value={handle}
            variant='outlined'
            onChange={handleChange}
            helperText={error.handle}
            error={error.handle ? true : false}
          />

          <Button type='submit' variant='contained' color='primary' disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'SignUp'}
          </Button>

          <br />

          <small>
            Already have an account ? <Link to='/login'>Login</Link>
          </small>
        </form>
      </Grid>

      {/* Alert Signup Failure */}

      <Snackbar
        open={signupFail}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant='filled' severity='error'>
          {error.email || error.handle || error.general}
        </Alert>
      </Snackbar>
    </SignupGrid>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default withRouter(connect(mapStateToProps, { signupUser })(SignupPage))
