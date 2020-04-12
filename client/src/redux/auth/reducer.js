import {
  AUTH_ERROR,
  LOAD_USER,
  LOGIN_FAIL,
  USER_LOGOUT,
  USER_LOADED,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOAD_USER_FAILURE,
} from '../action-types'

const initialState = {
  user: null,
  token: null,
  error: null,
  loading: false,
  isAuthenticated: false,
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('social-user-token', payload.token)
      return {
        user: null,
        error: null,
        loading: false,
        token: payload.token,
        isAuthenticated: true,
      }

    case LOAD_USER:
      return { ...state, loading: true }

    case LOAD_USER_FAILURE:
      return { ...state, loading: false, user: null, error: payload }

    case USER_LOADED:
      return {
        error: null,
        loading: false,
        isAuthenticated: true,
        user: payload.userData, // credentials, notifications
        token: payload.userToken,
      }

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case USER_LOGOUT:
    case REGISTER_FAIL:
      localStorage.removeItem('social-user-token')
      return initialState

    default:
      return state
  }
}
