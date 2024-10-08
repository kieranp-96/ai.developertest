import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const app = express();
const PORT = 5000;
const DATA_FILE = './data.json';

app.use(cors());
app.use(bodyParser.json());

// Check if data.json exists, if not generate it
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// reusable functions to read and write data
const readUsers = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// GET users function
app.get('/api/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// POST new user function
app.post('/api/users', (req, res) => {
  const newUser = { id: uuidv4(), ...req.body };
  const users = readUsers();
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// PUT update user function
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const users = readUsers();

  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;

  writeUsers(users);
  res.json(updatedUser);
});

// DELETE user function
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const users = readUsers();
  const updatedUsers = users.filter((user) => user.id !== id);
  writeUsers(updatedUsers);
  res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
