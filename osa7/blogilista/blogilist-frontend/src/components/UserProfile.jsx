import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export const UserProfile = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.userList);
  const currentUser = users.find((user) => user.id === id);

  if (!currentUser) return null;

  return (
    <div>
      <h2>{currentUser.name}</h2>
      <br></br>
      <h3>Added blogs:</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Blog</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {currentUser.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
