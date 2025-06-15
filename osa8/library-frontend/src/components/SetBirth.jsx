import { useQuery } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";

export const SetBirth = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [editYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    editYear({
      variables: { name, setBornTo: parseInt(born) },
    });

    setName("");
    setBorn("");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div>
        <h3>Set birthyear</h3>
        <div>
          name:{" "}
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select author</option>
            {authors.map((author, index) => (
              <option key={index} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born:{" "}
          <input
            type="number"
            id="bornInput"
            onChange={({ target }) => setBorn(target.value)}
            value={born}
          ></input>
        </div>
        <button type="submit">update</button>
      </div>
    </form>
  );
};
