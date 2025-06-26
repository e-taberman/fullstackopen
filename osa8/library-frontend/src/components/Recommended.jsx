import { CURRENT_USER, GENRE_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const RecommendedBooks = ({ favoriteGenre }) => {
  const { loading, data } = useQuery(GENRE_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  //   console.log(data.allBooks);

  if (loading) return <div>loading...</div>;
  if (!data) return <div>No books found</div>;

  return (
    <div>
      <h2>Recommendations</h2>
      <div>
        Books in your favorite genre <b>{favoriteGenre}</b>
        <br />
        <br />
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Recommended = (props) => {
  if (!props.show) {
    return null;
  }
  if (props.currentUserData) {
    // console.log(props.currentUserData);
    return (
      <RecommendedBooks
        favoriteGenre={props.currentUserData.me.favoriteGenre}
      />
    );
  }
};
