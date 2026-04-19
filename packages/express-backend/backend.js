import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users.users_list.filter((user) => user.name === name);
};

const findUserById = (id) => {
  return users.users_list.find((user) => user.id === id);
};

const findUsersByNameAndJob = (name, job) => {
  return users.users_list.filter(
    (user) => user.name === name && user.job === job,
  );
};

const addUser = (user) => {
  users.users_list.push(user);
  return user;
};

const generateId = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `id${randomNumber}`;
};

const deleteUserById = (id) => {
  const index = users.users_list.findIndex((user) => user.id === id);
  if (index === -1) {
    return false;
  }

  users.users_list.splice(index, 1);
  return true;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name !== undefined && job !== undefined) {
    const result = findUsersByNameAndJob(name, job);
    res.send({ users_list: result });
    return;
  }

  if (name !== undefined) {
    const result = findUserByName(name);
    res.send({ users_list: result });
    return;
  }

  res.send(users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
    return;
  }

  res.send(result);
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = { ...userToAdd, id: generateId() };
  addUser(newUser);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const wasDeleted = deleteUserById(id);

  if (!wasDeleted) {
    res.status(404).send("Resource not found.");
    return;
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
