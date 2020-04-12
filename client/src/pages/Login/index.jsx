import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { login } from '../../redux/auth/actions'

import { LoginContainer } from './styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import CircularProgress from '@material-ui/core/CircularProgress'

//

const LoginPage = ({ login, isAuthenticated, history }) => {
  const [formData, setFormDate] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  //

  const [loginFail, setLoginFail] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    setLoginFail(false)
  }

  //

  const handleChange = (e) => {
    setFormDate({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 4)
      return setErrors({ password: 'Short password, at-least 4 char' })

    setLoading(true)

    try {
      const res = await login(email, password)

      // only if login failed will be res
      if (!res) return

      setLoginFail(true)

      const error =
        (res.response && res.response.data && res.respoinse.data.general) ||
        'Login Failure'

      setErrors({ general: error })

      //
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  if (isAuthenticated) {
    history.push('/')
    return null
  }

  return (
    <LoginContainer>
      <h1>Login</h1>

      <Grid item xs={11} sm={6} md={5} lg={4}>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label='Email'
            variant='outlined'
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            placeholder='Enter email'
          />

          <TextField
            required
            fullWidth
            label='Password'
            variant='outlined'
            type='password'
            name='password'
            value={password}
            onChange={handleChange}
            error={errors.password ? true : false}
            helperText={errors.password}
            placeholder='Enter Password'
          />

          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={loading ? true : false}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </form>

        <p className='sign-up-link'>
          Do not have an account ?<Link to='/signup'>Signup</Link>
        </p>
      </Grid>

      {/* Alert Login Failure */}

      <Snackbar
        open={loginFail}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant='filled' severity='error'>
          {errors.general}
        </Alert>
      </Snackbar>
    </LoginContainer>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default withRouter(connect(mapStateToProps, { login })(LoginPage))
