import pool from "../db/pool.js";

export const getAllTodo = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const itemsPerPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 20);
    const offset = (page - 1) * itemsPerPage;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ message: "Invalid Page Number" });
    }

    if (isNaN(limit) || limit < 1 || limit > 20) {
      return res.status(400).json({ message: "Invalid Limit Value" });
    }

    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC LIMIT $1 OFFSET $2",
      [itemsPerPage, offset]
    );

    const totalItemsResult = await pool.query("SELECT COUNT(*) FROM todos");
    const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const returnObject = {
      todos: result.rows,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        itemsPerPage,
        totalItems,
        hasNextPage: page < totalPages,
      },
    };

    res.status(200).json(returnObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodoById = async (req, res) => {
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createTodo = async (req, res) => {
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTodo = async (req, res) => {
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
      "UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    const todoItemUpdated = result.rows[0];

    if (!todoItemUpdated) {
      return res.status(404).json({ message: "Todo Item not found" });
    }

    return res.status(200).json(todoItemUpdated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const completeTodo = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Todo Item ID" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Invalid Completed Data" });
  }

  try {
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    const todoItemUpdated = result.rows[0];

    if (!todoItemUpdated) {
      return res.status(404).json({ message: "Todo Item not found" });
    }

    return res.status(200).json(todoItemUpdated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id]
  );

  const todoDelete = result.rows[0];

  if (!todoDelete) {
    return res.status(404).json({ message: "Todo Item not found" });
  }

  return res.status(200).json(todoDelete);
};
