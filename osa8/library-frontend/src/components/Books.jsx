import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GENRE_BOOKS } from "../queries";
import { useEffect, useState } from "react";

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const { loading, data } = useQuery(GENRE_BOOKS, {
    variables: { genre: selectedGenre },
    skip: selectedGenre === "",
  });

  const result = useQuery(ALL_BOOKS);

  const books = [];
  if (!result.loading && result.data) {
    result.data.allBooks.forEach((book) => books.push(book));
  }

  const fetchGenres = () => {
    if (books.length > 0) {
      if (loading) return;
      let genres = [];
      books.forEach((book) => {
        book.genres.forEach((g) => genres.push(g));
      });
      genres = [...new Set(genres)];
      setGenres(genres);
    }
  };

  useEffect(() => {
    if (!result.loading && result.data) {
      fetchGenres();
    }
  }, [result.loading, result.data]);

  if (result.loading || loading) return <div>loading...</div>;
  // console.log("data:", data);

  return (
    <div>
      <h2>books</h2>

      {selectedGenre !== "" && (
        <p>
          selected genre: <b>{selectedGenre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {selectedGenre === "" &&
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          {selectedGenre !== "" &&
            data.allBooks.map((a) => {
              if (a.genres.includes(selectedGenre)) {
                return (
                  <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
      <button onClick={() => setSelectedGenre("")}>all genres</button>
      {genres.map((genre) => (
        <button onClick={() => setSelectedGenre(genre)} key={genre}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
