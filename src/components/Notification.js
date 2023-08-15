import { Alert } from '@mui/material'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div><Alert severity={isError ? 'error' : 'success'}>{message}</Alert>
    </div>
  )

}
export default Notification
