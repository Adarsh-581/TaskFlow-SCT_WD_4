const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, project, parent, recurrence, reminders, tags } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      parent,
      recurrence,
      reminders,
      tags,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tasks for the user
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const updates = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a task as complete
// @route   POST /api/tasks/:id/complete
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { completed: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}; 