import express from "express";
import { createTodo, getTodos , updateTodo , deleteTodo } from "../controller/todo.controller.js"; // add .js extension if ESM

const router = express.Router();

// POST /todo/create
router.post("/create", createTodo);
router.get("/fetch",getTodos);
router.put("/update/:id",updateTodo);
router.delete("/delete/:id",deleteTodo);
export default router;
