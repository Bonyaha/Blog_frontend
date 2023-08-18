import { forwardRef, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  /* return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} style={{ marginBottom: '15px' }}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} style={{ marginTop: '5px' }}>cancel</button>
      </div>
    </div>
  ) */
  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          onClick={toggleVisibility}
          variant="contained"
          color="primary"
          style={{ marginBottom: '15px' }}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          onClick={toggleVisibility}
          variant="contained"
          color="secondary"
          style={{ marginTop: '5px' }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
