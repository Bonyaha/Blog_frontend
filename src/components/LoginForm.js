import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box } from '@mui/material'

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
        <Box display="flex" flexDirection="column" gap={2} maxWidth={300} mx="auto">

          <TextField label="username" onChange={({ target }) => setUsername(target.value)} required />


          <TextField label="password" type='password' onChange={({ target }) => setPassword(target.value)} required />

          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </Box>
      </form>
    </div>
  )
}



export default LoginForm
