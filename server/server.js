import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const PORT = 2008;

// Use an absolute path so Node ALWAYS writes to the correct file
const FILE = path.resolve("todos.json");

const app = express();

app.use(express.json());
app.use(cors());

// Load todos
function loadTodos() {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load todos:", err);
    return [];
  }
}

// Save todos
function saveTodos(todos) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(todos, null, 2));
    console.log("Saved todos to:", FILE);
  } catch (err) {
    console.error("Failed to save todos:", err);
  }
}

app.get("/todos", (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const todos = loadTodos();
  const nextId = todos.length === 0 ? 1 : Math.max(...todos.map(t => t.id)) + 1;
  const { title } = req.body;
  const newTodo = { id: nextId, title, done: false };
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todos = loadTodos();
  const updated = todos.filter(t => t.id !== id);
  saveTodos(updated);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Todo file:", FILE);
});
