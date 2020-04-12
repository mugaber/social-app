import Axios from 'axios'
import { setAuthToken } from '../../utils'
import {
  LOAD_USER,
  AUTH_ERROR,
  LOGIN_FAIL,
  USER_LOGOUT,
  USER_LOADED,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOAD_USER_FAILURE,
} from '../action-types'

//

const loadUser = () => async (dispatch) => {
  dispatch({ type: LOAD_USER })

  const userToken = localStorage.getItem('social-user-token')

  if (!userToken) {
    return dispatch({ type: AUTH_ERROR })
  }

  setAuthToken(userToken)

  try {
    const userData = await Axios.get('/user')

    dispatch({
      type: USER_LOADED,
      payload: { userData, userToken },
    })
  } catch (err) {
    // err -> response -> {data, status, statusText, headers, config, request}
    const response = err.response

    // internal server error, not from token, should try login again
    if (response.status === 500) {
      return dispatch({ type: LOAD_USER_FAILURE, payload: response.statusText })
    }

    dispatch({ type: AUTH_ERROR })
  }
}

//

const signupUser = ({ handle, email, password }) => async (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } }
  const body = JSON.stringify({ handle, email, password, confirmPass: password })

  try {
    const res = await Axios.post('/auth/signup', body, config)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())

    return 'success'
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
    })

    return err.response
  }
}

//

const login = (email, password) => async (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } }
  const body = JSON.stringify({ email, password })

  try {
    const res = await Axios.post('/auth/login', body, config)

    // res -> data -> token

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    // err -> response -> data -> error

    dispatch({
      type: LOGIN_FAIL,
    })

    return err
  }
}

//

const logout = () => (dispatch) => {
  dispatch({ type: USER_LOGOUT })
}

export { loadUser, signupUser, login, logout }
