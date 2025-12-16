import { useEffect, useState } from "react";
import "./App.css";
import TodoItem from "./TodoItem";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState([]); // ← NUEVO

  const API = "http://localhost:3000/tasks";

  const loadTasks = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setText("");
    loadTasks();
  };

  const editTask = async (id, newText) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadTasks();
  };

  // ← NUEVO: manejar selecciones
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ← NUEVO: borrar seleccionadas
  const deleteSelected = async () => {
    await fetch(`${API}/delete-multiple`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });

    setSelected([]);
    loadTasks();
  };

  return (
    <div className="app-container">
      <h1>LISTA DE TAREAS</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Añadir Tarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Añadir Tarea</button>
      </form>

      {/* Botón para borrar varias */}
      {selected.length > 0 && (
        <button className="delete-multiple" onClick={deleteSelected}>
          Eliminar seleccionadas ({selected.length})
        </button>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onEdit={editTask}
            onSelect={toggleSelect}
            selected={selected.includes(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
