import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
import { addComment } from "../reducers/blogReducer";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

export const BlogDisplay = ({ onLikeClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  var currentUser = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const currentBlog = blogs.find((blog) => blog.id === id);

  const handleCommenting = () => {
    const comment = document.getElementsByName("commentBox")[0];
    blogService.addComment(id, currentUser, comment.value);
    dispatch(addComment({ id: id, comment: comment.value }));
    comment.value = "";
  };

  if (!currentBlog) return null;

  return (
    <div>
      <h2>{currentBlog.title}</h2>
      <a
        href={
          currentBlog.url.startsWith("http://") ||
          currentBlog.url.startsWith("https://")
            ? currentBlog.url
            : `https://${currentBlog.url}`
        }
        rel="noopener noreferrer"
      >
        {currentBlog.url}
      </a>
      <br></br>
      {`Likes: ${currentBlog.likes}`}{" "}
      <p>
        Added by{" "}
        <Link to={`/users/${currentBlog.user.id}`}>
          {currentBlog.user.name}
        </Link>
      </p>
      <Button onClick={() => onLikeClick(currentBlog)}>Like</Button>
      <span> </span>
      {currentUser.username === currentBlog.user.username && (
        <Button
          style={{ backgroundColor: "#b50e2a" }}
          onClick={() => {
            onDeleteClick(currentBlog);
            navigate("/");
          }}
        >
          Delete
        </Button>
      )}
      <br></br>
      <br></br>
      <h3>Comments:</h3>
      <br></br>
      <Form.Group className="mb-3" controlId={id} style={{ maxWidth: "250px" }}>
        <Form.Control name="commentBox" />
        <Button onClick={handleCommenting}>Add comment</Button>
      </Form.Group>
      <br></br>
      <br></br>
      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {currentBlog.comments.map((comment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
