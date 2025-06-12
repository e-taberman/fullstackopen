import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const BlogDisplay = ({ onLikeClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);

  const currentBlog = blogs.find((blog) => blog.id === id);

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
      {`likes: ${currentBlog.likes}`}{" "}
      <button onClick={() => onLikeClick(currentBlog)}>like</button>
      <p>
        Added by{" "}
        <Link to={`/users/${currentBlog.user.id}`}>
          {currentBlog.user.name}
        </Link>
      </p>
      <button
        style={{ backgroundColor: "#ffcccc" }}
        onClick={() => {
          onDeleteClick(currentBlog);
          navigate("/");
        }}
      >
        delete
      </button>
    </div>
  );
};
