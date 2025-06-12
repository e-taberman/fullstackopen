import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

export const NavigationBar = ({ handleLogout }) => {
  var currentUser = useSelector((state) => state.user);

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
        </Nav>
        <Navbar.Text className="me-2">
          {currentUser.name} has logged in
        </Navbar.Text>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          logout
        </button>
      </Container>
    </Navbar>
  );
};
