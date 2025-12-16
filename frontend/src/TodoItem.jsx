export default function TodoItem({
  task,
  onDelete,
  onEdit,
  onSelect,
  selected,
}) {
  const handleEdit = () => {
    const newText = prompt("Editar tarea:", task.text);
    if (newText) onEdit(task.id, newText);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>

      {/* Checkbox de selección múltiple */}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(task.id)}
      />

      <span>{task.text}</span>

      <div className="task-actions">
        <button onClick={handleEdit} className="edit">✏️</button>
        <button onClick={() => onDelete(task.id)} className="delete">🗑️</button>
      </div>
    </div>
  );
}
