import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const NavigationBar = ({ handleLogout }) => {
  var currentUser = useSelector((state) => state.user);

  return (
    <div>
      <Link to="/">Blogs</Link>
      <Link to="/users">Users</Link>
      {currentUser.name} has logged in{" "}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
