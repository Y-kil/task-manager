const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// All routes protected by JWT
router.use(verifyToken);

// GET    /api/tasks         - get all tasks (with optional filters)
// POST   /api/tasks         - create task
// GET    /api/tasks/:id     - get single task
// PUT    /api/tasks/:id     - update task
// DELETE /api/tasks/:id     - delete task
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
