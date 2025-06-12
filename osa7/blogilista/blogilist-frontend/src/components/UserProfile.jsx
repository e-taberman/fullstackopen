import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const UserProfile = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.userList);
  const currentUser = users.find((user) => user.id === id);

  if (!currentUser) return null;

  return (
    <div>
      <h2>{currentUser.name}</h2>
      <br></br>
      <h3>Added blogs</h3>
      <ul>
        {currentUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};
