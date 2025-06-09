import { useReducer, createContext, useContext, useEffect } from 'react'
let timer

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.content
    case 'CLEAR':
      return ''
    default:
      return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  useEffect(() => {
    if (notification) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [notification])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext