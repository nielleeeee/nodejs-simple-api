import express from "express";
import {
  getAllTodo,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

// Get all todo item
router.get("/todo", getAllTodo);

// Get single todo item
router.get("/todo/:id", getTodoById);

// Create new todo item
router.post("/todo", createTodo);

// Update todo item
router.patch("/todo/:id", updateTodo);

router.patch("/todo/:id/complete", completeTodo);

// Delete todo item
router.delete("/todo/:id", deleteTodo);

export default router;