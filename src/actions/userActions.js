import loginService from '../services/login'
import blogService from '../services/blogs'

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: user,
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(setUser(user))
    return user
  }

}

export const logOut = () => {
  return {
    type: 'LOG_OUT',
  }
}