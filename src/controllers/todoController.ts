import { Request, Response } from "express";
import pool from "@/db/pool";

interface GetAllTodoQueryParams {
  page?: string;
  limit?: string;
}

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getAllTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { page = "1", limit = "10" } = req.query as GetAllTodoQueryParams;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const itemsPerPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 20);
    const offset = (parsedPage - 1) * itemsPerPage;

    if (isNaN(parsedPage) || parsedPage < 1) {
      res.status(400).json({ message: "Invalid Page Number" });
      return;
    }

    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
      res.status(400).json({ message: "Invalid Limit Value" });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC LIMIT $1 OFFSET $2",
      [itemsPerPage, offset]
    );

    const totalItemsResult = await pool.query("SELECT COUNT(*) FROM todos");
    const totalItems = parseInt(totalItemsResult.rows[0].count as string, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const returnObject = {
      todos: result.rows,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        itemsPerPage,
        totalItems,
        hasNextPage: parsedPage < totalPages,
      },
    };

    res.status(200).json(returnObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Invalid Todo Item ID" });
      return;
    }

    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);

    const todoItem = result.rows[0] as TodoItem;

    if (!todoItem) {
      res.status(404).json({ message: "Todo Item not found" });
      return;
    }

    res.status(200).json(todoItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description } = req.body as TodoItem;

  try {
    if (!title || !description) {
      res.status(400).json({ message: "Invalid Todo Data" });
      return;
    }

    const result = await pool.query(
      "INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    const todoItem = result.rows[0] as TodoItem;

    res.status(201).json(todoItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { title, description } = req.body as TodoItem;

  if (!id) {
    res.status(400).json({ message: "Invalid Todo Item ID" });
    return;
  }

  if (!title || !description) {
    res.status(404).json({ message: "Invalid Update Data" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    const todoItemUpdated = result.rows[0] as TodoItem;

    if (!todoItemUpdated) {
      res.status(404).json({ message: "Todo Item not found" });
      return;
    }

    res.status(200).json(todoItemUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { completed } = req.body as TodoItem;

  if (!id) {
    res.status(400).json({ message: "Invalid Todo Item ID" });
    return;
  }

  if (typeof completed !== "boolean") {
    res.status(400).json({ message: "Invalid Completed Data" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );

    const todoItemUpdated = result.rows[0] as TodoItem;

    if (!todoItemUpdated) {
      res.status(404).json({ message: "Todo Item not found" });
      return;
    }

    res.status(200).json(todoItemUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Invalid User ID" });
    return;
  }

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    const todoDelete = result.rows[0] as TodoItem;

    if (!todoDelete) {
      res.status(404).json({ message: "Todo Item not found" });
      return;
    }

    res.status(200).json(todoDelete);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
