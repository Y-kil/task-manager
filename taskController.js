const db = require('../config/db');

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
  const { status, priority, search } = req.query;
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.user.id];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (priority) { query += ' AND priority = ?'; params.push(priority); }
  if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }

  query += ' ORDER BY created_at DESC';

  try {
    const [tasks] = await db.query(query, params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get single task
const getTaskById = async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (tasks.length === 0) return res.status(404).json({ message: 'Task not found.' });
    res.json(tasks[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required.' });

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, status || 'pending', priority || 'medium', due_date || null]
    );
    res.status(201).json({ message: 'Task created.', taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?',
      [title, description, status, priority, due_date, req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
