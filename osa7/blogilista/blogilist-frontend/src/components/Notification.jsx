import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification === "") return null;

  const notificationStyle = {
    color: notification.color || "red",
    fontWeight: "bold",
    borderStyle: "solid",
    padding: "5px",
    marginBottom: "10px",
  };

  return <div style={notificationStyle}>{notification.content}</div>;
};

export default Notification;
