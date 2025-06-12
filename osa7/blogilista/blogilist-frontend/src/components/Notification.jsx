import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification === "") return null;

  // const notificationStyle = {
  //   color: notification.color || "red",
  //   fontWeight: "bold",
  //   borderStyle: "solid",
  //   padding: "5px",
  //   marginBottom: "10px",
  // };

  // return <Alert style={notificationStyle}>{notification.content}</Alert>;
  switch (notification.color) {
    case "red":
      return <Alert variant="danger">{notification.content}</Alert>;
    case "green":
      return <Alert variant="success">{notification.content}</Alert>;
  }
};

export default Notification;
