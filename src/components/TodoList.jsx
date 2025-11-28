import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Load todos from server
  useEffect(() => {
    fetch("http://localhost:2008/todos")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  // Add task
  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;

    fetch("http://localhost:2008/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks(prev => [...prev, newTask]);
        setInput("");
      });
  }

  // Delete task
  function deleteTask(id) {
    fetch(`http://localhost:2008/todos/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== id));
      });
  }

  // Toggle done
  function toggleDone(id, done) {
    fetch(`http://localhost:2008/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      });
  }

  return (
    <div className="todoList">
      <h2>Todo List</h2>

      <form className="form" onSubmit={addTask}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todolist__ul">
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={(e) => toggleDone(task.id, e.target.checked)}
            />

            <p style={{ textDecoration: task.done ? "line-through" : "none" }}>
              {task.title}
            </p>

            <button onClick={() => deleteTask(task.id)}>
              <FaRegTrashAlt color="#333" size="20px" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
