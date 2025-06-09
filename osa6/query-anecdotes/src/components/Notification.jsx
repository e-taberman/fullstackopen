import NotificationContext from '../context/NotificationContext'
import { useContext } from 'react'

const Notification = (props) => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (notification === '') return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
