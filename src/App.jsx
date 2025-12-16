import { useEffect, useState } from "react";
import "./App.css";
import TodoItem from "./TodoItem";
import { API_URL } from "./config";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      setText("");
      loadTasks();
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const editTask = async (id, newText) => {
    try {
      const currentTask = tasks.find(t => t.id === id);
      
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: newText,
          completed: currentTask?.completed || 0
        }),
      });
      loadTasks();
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      loadTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    try {
      await fetch(`${API_URL}/tasks/delete-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });

      setSelected([]);
      loadTasks();
    } catch (error) {
      console.error('Error al eliminar tareas:', error);
    }
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