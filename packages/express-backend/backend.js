import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error.");
    });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  userService
    .findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
        return;
      }

      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error.");
    });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  userService
    .removeUser(id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.status(404).send("Resource not found.");
        return;
      }

      res.status(204).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
