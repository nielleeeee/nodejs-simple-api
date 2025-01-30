import { Request, Response } from "express";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { todos } from "@/db/schema";

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

    const todoResult = await db
      .select()
      .from(todos)
      .orderBy(todos.id)
      .limit(itemsPerPage)
      .offset(offset);

    const totalItemsResult = await db
      .select({ count: sql`COUNT(*)`.as("count") })
      .from(todos);
    const totalItems = parseInt(totalItemsResult[0].count as string, 10);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const returnObject = {
      todos: todoResult,
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

    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, Number(id)));

    const todoItem = result[0];

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

    const result = await db
      .insert(todos)
      .values({ title, description })
      .returning();

    const newTodo = result[0];

    res.status(201).json(newTodo);
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
    const todoItemUpdated = await db
      .update(todos)
      .set({ title, description })
      .where(eq(todos.id, Number(id)))
      .returning();

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
    const result = await db
      .update(todos)
      .set({ completed })
      .where(eq(todos.id, Number(id)))
      .returning();

    const todoItemUpdated = result[0];

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
    const result = await db
      .delete(todos)
      .where(eq(todos.id, Number(id)))
      .returning();

    const deletedTodo = result[0];

    if (!deletedTodo) {
      res.status(404).json({ message: "Todo Item not found" });
      return;
    }

    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
