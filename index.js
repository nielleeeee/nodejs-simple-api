const express = require("express");
const fs = require("fs");
const multer = require("multer");

const app = express();
const port = 3000;
const upload = multer();

app.use(express.json());

const users = [
  { id: "1", name: "Jan", age: 30 },
  { id: "2", name: "John", age: 25 },
  { id: "3", name: "Danielle", age: 35 },
];

app.get("/", (req, res) => {
  res.send("Simple Nodejs API");
});

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: "Invalid User Data" });
  }

  const newUser = { id: (users.length + 1).toString(), name, age };

  users.push(newUser);

  return res.status(201).json(newUser);
});

app.patch("/users/:id", (req, res) => {
  const { id } = req.params;

  const { name, age } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!name || !age) {
    return res.status(400).json({ message: "Missing User Data" });
  }

  user.name = name;
  user.age = age;

  return res.status(200).json(user);
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  users = users.filter((user) => user.id !== id);

  return res.status(200).json(user);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
