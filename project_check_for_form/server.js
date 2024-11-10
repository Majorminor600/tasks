import express from 'express';
import { TaskList } from './src/models/TaskList.js';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const taskList = new TaskList();

app.use(express.static('public'));
app.use(bodyParser.json());

// API endpoints
app.get('/api/tasks', async (req, res) => {
  await taskList.loadFromFile();
  res.json(taskList.getAllTasks());
});

app.post('/api/tasks', async (req, res) => {
  const { title, description } = req.body;
  const task = await taskList.addTask(title, description);
  res.json(task);
});

app.put('/api/tasks/:id/toggle', async (req, res) => {
  const id = parseInt(req.params.id);
  const success = await taskList.toggleTaskComplete(id);
  res.json({ success });
});

app.delete('/api/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const success = await taskList.removeTask(id);
  res.json({ success });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});