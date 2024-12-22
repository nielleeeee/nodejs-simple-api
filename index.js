const express = require("express");
const fs = require("fs");
const multer = require("multer");
const pool = require("./db");

const app = express();
const port = 3000;
const upload = multer();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Simple Nodejs API");
});

app.get("/todo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

app.get("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Invalid Todo Item ID" });
    }

    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);

    const todoItem = result.rows[0];

    if (!todoItem) {
      return res.status(404).json({ message: "Todo Item not found" });
    }

    return res.status(200).json(todoItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

app.post("/todo", async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Invalid Todo Data" });
    }

    const result = await pool.query(
      "INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    const todoItem = result.rows[0];

    return res.status(201).json(todoItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

app.patch("/todo/:id", async (req, res) => {
  const { id } = req.params;

  const { title, description } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Todo Item ID" });
  }

  if (!title || !description) {
    return res.status(404).json({ message: "Invalid Update Data" });
  }

  try {
    const result = await pool.query(
      "UPDATE todos SET title='$1', description='$2' WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    const todoItemUpdated = result.rows[0];

    if (!todoItemUpdated) {
      return res.status(404).json({ message: "Todo Item not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const result = await pool.query(
    "DELETE FROM todos WHERE id='$1' RETURNING *",
    [id]
  );

  const todoDelete = result.rows[0];

  if (!todoDelete) {
    return res.status(404).json({ message: "Todo Item not found" });
  }

  return res.status(200).json(todoDelete);
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
