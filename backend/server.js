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
  data.tasks.push(newTask);
  
  writeDB(data);
  res.json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const data = readDB();
  const id = parseInt(req.params.id);
  const updatedTask = req.body;
  
  const index = data.tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    data.tasks[index] = updatedTask;
    writeDB(data);
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const data = readDB();
  const id = parseInt(req.params.id);
  
  data.tasks = data.tasks.filter(t => t.id !== id);
  
  writeDB(data);
  res.json({ ok: true });
});

// GET /users (para login)
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