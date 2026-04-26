// src/MyApp.jsx

import React, { useEffect, useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  function deleteUser(userId) {
    return fetch(`http://localhost:8000/users/${userId}`, {
      method: "DELETE",
    });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json.users_list))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneCharacter(userId) {
    deleteUser(userId)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prevCharacters) =>
            prevCharacters.filter(
              (character) => character._id !== userId,
            ),
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) {
          throw new Error(`Unexpected status code: ${res.status}`);
        }

        return res.json();
      })
      .then((newUser) => {
        setCharacters((prevCharacters) => [...prevCharacters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
