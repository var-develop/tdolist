const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = './db.json';

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// GET /tasks
app.get('/tasks', (req, res) => {
  const data = readDB();
  res.json(data.tasks || []);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const data = readDB();
  const newTask = req.body;
  
  if (!data.tasks) data.tasks = [];
  
  // Asignar un ID si no viene
  if (!newTask.id) {
    newTask.id = Date.now();
  }
  
  // Asegurar que tenga completed
  if (newTask.completed === undefined) {
    newTask.completed = 0;
  }
  
  data.tasks.push(newTask);
  writeDB(data);
  res.json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const data = readDB();
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const index = data.tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    // Actualizar solo lo que viene en el body
    data.tasks[index] = {
      ...data.tasks[index],
      text: text !== undefined ? text : data.tasks[index].text,
      completed: completed !== undefined ? completed : data.tasks[index].completed
    };
    
    writeDB(data);
    res.json(data.tasks[index]);
  } else {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const data = readDB();
  const id = parseInt(req.params.id);
  
  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter(t => t.id !== id);
  
  if (data.tasks.length < initialLength) {
    writeDB(data);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

// POST /tasks/delete-multiple
app.post('/tasks/delete-multiple', (req, res) => {
  const data = readDB();
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids inválidos' });
  }
  
  data.tasks = data.tasks.filter(t => !ids.includes(t.id));
  writeDB(data);
  res.json({ ok: true });
});

// GET /users (para login si lo necesitas)
app.get('/users', (req, res) => {
  const data = readDB();
  const { username, password } = req.query;
  
  const user = data.users?.find(u => u.username === username && u.password === password);
  
  res.json(user ? [user] : []);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});