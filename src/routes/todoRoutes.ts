import express, { Request, Response } from "express";
import {
  getAllTodo,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = express.Router();

// Get all todo item
router.get("/", (req: Request, res: Response) => {
  getAllTodo(req, res);
});

// Get single todo item
router.get("/:id", (req: Request, res: Response) => {
  getTodoById(req, res);
});

// Create new todo item
router.post("/", (req: Request, res: Response) => {
  createTodo(req, res);
});

// Update todo item
router.patch("/:id", (req: Request, res: Response) => {
  updateTodo(req, res);
});

router.patch("/:id/complete", (req: Request, res: Response) => {
  completeTodo(req, res);
});

// Delete todo item
router.delete("/:id", (req: Request, res: Response) => {
  deleteTodo(req, res);
});

export default router;
