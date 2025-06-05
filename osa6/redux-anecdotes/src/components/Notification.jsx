import { useSelector } from 'react-redux'
import { useRef } from 'react'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (!notification) {
    return (<div></div>)
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification