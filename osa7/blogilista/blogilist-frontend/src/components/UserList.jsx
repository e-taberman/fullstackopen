import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export const UserList = () => {
  const users = useSelector((state) => state.userList);
  return (
    <div>
      <h1>Users</h1>
      <Table striped bordered>
        <thead>
          <tr>
            <th style={{ width: "50%" }}>User</th>
            <th style={{ width: "50%" }}>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice()
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <tr key={user.id}>
                <td style={{ width: "50%" }}>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td style={{ width: "50%" }}>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};
