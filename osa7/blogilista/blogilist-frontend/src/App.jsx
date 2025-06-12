import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogCreator from "./components/BlogCreator";
import { setNotification } from "./reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  appendBlog,
  initializeBlogs,
  deleteBlog,
  updateBlog,
  increaseLikes,
} from "./reducers/blogReducer";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserList } from "./components/UserList";
import { initializeUsers } from "./reducers/userListReducer";
import { UserProfile } from "./components/UserProfile";
import { BlogDisplay } from "./components/BlogDisplay";
import { NavigationBar } from "./components/NavigationBar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { addUser, removeUser } from "./reducers/userReducer";
import LoginForm from "./components/LoginForm";
import { color } from "chart.js/helpers";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  var blogs = useSelector((state) => state.blogs);
  var currentUser = useSelector((state) => state.user);

  useEffect(() => {
    automaticLogin();
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, []);

  const automaticLogin = () => {
    const localStorage = window.localStorage.getItem("user");

    if (localStorage === null) return;

    const parsed = JSON.parse(localStorage);
    setUsername(parsed.username);
    setPassword(parsed.password);

    loginService.login(parsed.username, parsed.password).then((response) => {
      dispatch(addUser(response));
    });
  };

  const handleLogout = () => {
    dispatch(removeUser());
    window.localStorage.removeItem("user");
  };

  const handleLogin = () => {
    loginService
      .login(username, password)
      .then((response) => {
        const loginUser = JSON.stringify({
          username: username,
          password: password,
        });
        dispatch(addUser(response));
        window.localStorage.setItem("user", loginUser);
        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(
            setNotification({
              content: "wrong username or password",
              color: "red",
            }),
          );
        }
      });
  };

  const onLikeClick = async (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: parseInt(blog.likes) + 1,
    };
    try {
      const updatedBlog = await blogService.updateBlog(
        blog.id,
        newBlog,
        currentUser,
      );
      dispatch(increaseLikes(updatedBlog.data));
    } catch (error) {
      if (error.response.status === 401) {
        dispatch(
          setNotification({
            content: "unauthorized",
            color: "red",
          }),
        );
      } else {
        dispatch(
          setNotification({
            content: error,
            color: "red",
          }),
        );
      }
      return;
    }

    dispatch(
      setNotification({
        content: `"${newBlog.title}" by ${newBlog.author} liked`,
        color: "green",
      }),
    );
  };

  const onDeleteClick = async (blog) => {
    if (!confirm(`Do you want to delete "${blog.title}" by ${blog.author}`)) {
      return;
    }
    try {
      await blogService.deleteBlog(blog.id, currentUser);
    } catch (error) {
      if (error.response.status === 401) {
        dispatch(
          setNotification({
            content: "unauthorized",
            color: "red",
          }),
        );
      } else {
        dispatch(
          setNotification({
            content: error,
            color: "red",
          }),
        );
      }
      return;
    }

    dispatch(
      setNotification({
        content: `"${blog.title}" by ${blog.author} deleted`,
        color: "green",
      }),
    );
    dispatch(deleteBlog(blog));
  };

  const createNewBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.postBlog(newBlog, currentUser);

      const fixedBlog = {
        ...createdBlog.data,
        user: {
          name: currentUser.name,
          username: currentUser.username,
          id: createdBlog.data.user,
        },
      };
      dispatch(appendBlog(fixedBlog));
    } catch (error) {
      if (error.response.status === 400) {
        dispatch(
          setNotification({
            content: "title or URL missing",
            color: "red",
          }),
        );
      } else if (error.response.status === 401) {
        dispatch(
          setNotification({
            content: "unauthorized",
            color: "red",
          }),
        );
      }
      return;
    }
    dispatch(
      setNotification({
        content: `a new blog "${newBlog.title} by ${newBlog.author} added"`,
        color: "green",
      }),
    );
  };

  // NOT LOGGED IN
  if (currentUser === null) {
    return (
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  // LOGGED IN
  return (
    <Router>
      <div className="container">
        <NavigationBar handleLogout={handleLogout} />
        <h2>Blog App</h2>
        <Notification />
        <br></br>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <BlogCreator onBlogCreation={createNewBlog} />
                <br></br>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs
                      .slice()
                      .sort((a, b) => b.likes - a.likes)
                      .map((blog) => (
                        <tr key={blog.id}>
                          <td>
                            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                          </td>
                          <td>{blog.author}</td>
                          <td>{blog.likes}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            }
          />

          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogDisplay
                onLikeClick={onLikeClick}
                onDeleteClick={onDeleteClick}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
