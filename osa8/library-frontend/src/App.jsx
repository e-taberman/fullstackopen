import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { LoginForm } from "./components/LoginForm";
import { Recommended } from "./components/Recommended";
import { CURRENT_USER } from "./queries";
import { useQuery } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const { loading, data } = useQuery(CURRENT_USER);

  if (page === "login" && token) setPage("authors");

  const autoToken = localStorage.getItem("library-user-token");
  if (autoToken && !token) setToken(autoToken);

  const handleLogOut = () => {
    localStorage.removeItem("library-user-token");
    setPage("authors");
    setToken(null);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommended")}>recommended</button>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={handleLogOut}>logout</button>}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} currentUserData={data} />

      <Recommended show={page === "recommended"} currentUserData={data} />

      <LoginForm show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
