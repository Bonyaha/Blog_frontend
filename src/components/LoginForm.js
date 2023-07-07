import { useState } from 'react'
import PropTypes from 'prop-types'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, logOut, login } from '../actions/userActions'

const LoginForm = ({ setSuccessMessage, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const handleLogin = async (username, password) => {
    try {
      /* const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user)) */
      const user = await dispatch(login(username, password))
      console.log('user is ', user);

      setSuccessMessage(`Hello ${user.name}👋`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('username', username)
    console.log('password', password)
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            required
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            required
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>
          login
        </button>
      </form>
    </div>
  )
}

/* LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
} */

export default LoginForm
