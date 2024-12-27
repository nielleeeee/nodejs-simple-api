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
router.get("/", getAllTodo);

// Get single todo item
router.get("/:id", getTodoById);

// Create new todo item
router.post("/", createTodo);

// Update todo item
router.patch("/:id", updateTodo);

router.patch("/:id/complete", completeTodo);

// Delete todo item
router.delete("/:id", deleteTodo);

export default router;