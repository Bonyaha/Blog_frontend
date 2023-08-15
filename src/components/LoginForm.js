import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ setNotification, clearNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (username, password) => {
    try {
      const user = await dispatch(login(username, password))
      console.log('user is ', user)
      navigate('/')
      dispatch(setNotification({ message: `Hello ${user.name}👋`, isError: false }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (exception) {
      dispatch(setNotification({ message: 'Wrong credentials', isError: true }))
      setTimeout(() => {
        dispatch(clearNotification())
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
        {/* <div>
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
        </button> */}
        <div>
          <TextField label="username" onChange={({ target }) => setUsername(target.value)} required />
        </div>
        <div>
          <TextField label="password" type='password' onChange={({ target }) => setPassword(target.value)} required />
        </div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}



export default LoginForm
