const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }
 console.log(isError)
 console.log(message)
  return <div className={isError ? 'error' : 'success'}>{message}</div>
}

export default Notification
