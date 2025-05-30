import { useState, useEffect } from 'react'

const Notification = (props) => {
  const notificationStyle = {
    color: props.color || "red",
    fontWeight: "bold",
    borderStyle: "solid",
    padding: "5px",
    marginBottom: "10px"
  }

  useEffect(() => {
    if (props.message) {
      const timer = setTimeout(() => {
        props.setErrorText("")
      }, 2000)
      return () => clearTimeout(timer);
    }
  })

  if (props.message !== "") return <div style={notificationStyle}>{props.message}</div>
  else return <div>{props.message}</div>
}

export default Notification