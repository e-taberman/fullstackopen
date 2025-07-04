import { gql, useQuery } from "@apollo/client";
import { SetBirth } from "./SetBirth";
import { ALL_AUTHORS } from "../queries";

const Authors = (props) => {
  if (!props.show) {
    return null;
  }

  const result = useQuery(ALL_AUTHORS);

  if (result.loading) return <div>loading...</div>;

  const authors = [];
  result.data.allAuthors.forEach((author) => authors.push(author));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && <SetBirth authors={authors} />}
    </div>
  );
};

export default Authors;
