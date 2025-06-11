import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const blog = {
  title: "Test Title",
  author: "Test Author",
  url: "www.testurl.com",
  likes: 50000,
  user: {
    username: "testuser",
    name: "Test User",
  },
  id: "12345",
};

const user = {
  username: "testuser",
  name: "Test User",
};

const onLikeClick = () => {};
const onDeleteClick = () => {};

test("renders blog title", () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      onLikeClick={onLikeClick}
      onDeleteClick={onDeleteClick}
    />,
  );
  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent("Test Title");
});

test('url, user and likes are shown after clicking "view" button', async () => {
  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      onLikeClick={onLikeClick}
      onDeleteClick={onDeleteClick}
    />,
  );
  const userE = userEvent.setup();
  const button = screen.getByText("view");
  await userE.click(button);

  const div = container.querySelector(".blogDetails");

  expect(div).toHaveTextContent("www.testurl.com");
  expect(div).toHaveTextContent("Test User");
  expect(div).toHaveTextContent("likes");
});

test("when liking a blog twice, onLikeClick is also called twice", async () => {
  const mockHandler = vi.fn();
  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      onLikeClick={mockHandler}
      onDeleteClick={mockHandler}
    />,
  );

  const button = screen.getByText("like");
  const userE = userEvent.setup();

  await userE.click(button);
  await userE.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
