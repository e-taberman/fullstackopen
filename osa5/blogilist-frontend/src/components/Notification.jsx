import { useEffect } from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, setErrorText, color }) => {
  const notificationStyle = {
    color: color || "red",
    fontWeight: "bold",
    borderStyle: "solid",
    padding: "5px",
    marginBottom: "10px"
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setErrorText("")
      }, 2000)
      return () => clearTimeout(timer);
    }
  }, [message])

  if (message !== "") return <div style={notificationStyle}>{message}</div>
  else return <div>{message}</div>
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  setErrorText: PropTypes.func.isRequired,
}

export default Notification