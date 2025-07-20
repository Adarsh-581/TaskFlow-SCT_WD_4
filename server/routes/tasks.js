const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask
} = require('../controllers/tasksController');

// All routes protected
router.use(auth);

// @route   POST /api/tasks
router.post('/', createTask);

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   GET /api/tasks/:id
router.get('/:id', getTaskById);

// @route   PUT /api/tasks/:id
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

// @route   POST /api/tasks/:id/complete
router.post('/:id/complete', completeTask);

module.exports = router;
