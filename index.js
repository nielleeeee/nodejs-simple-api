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

// File checker
app.post("/file/check", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (file.mimetype !== "text/plain") {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const fileContent = file.buffer.toString("utf-8");
    const letterCount = fileContent.length;
    const wordCount = fileContent.split(/\s+/).filter(Boolean).length;

    return res
      .status(200)
      .json({ message: "File checked successfully", wordCount, letterCount });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// Fetch sample data
app.get("/fetch", async (req, res) => {
  try {
    const rawData = await fetch(
      "https://64f4a6b7932537f4051a9111.mockapi.io/nielle/store-data"
    );
    const data = await rawData.json();

    return res.status(200).json({ message: "Fetching data from API", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// console.log('Start of the program');

// fs.readFile(__filename, () => {
//   console.log('I/O callback: File read completed');
// });

// setTimeout(() => {
//   console.log('setTimeout: Timer phase');
// }, 1000);

// setImmediate(() => {
//   console.log('setImmediate: Check phase');
// });

// console.log('End of the program');
