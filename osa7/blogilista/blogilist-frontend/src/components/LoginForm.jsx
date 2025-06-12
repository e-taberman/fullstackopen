import React from "react";
import Notification from "./Notification";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => (
  <Container
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <Card
      style={{
        width: "30rem",
        padding: "2rem",
      }}
    >
      <Card.Body>
        <Card.Title className="mb-4 text-center">
          Login to application
        </Card.Title>
        <Notification />
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password"
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" data-testid="loginButton">
              Login
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  </Container>
);

export default LoginForm;
