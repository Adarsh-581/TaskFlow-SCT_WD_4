const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectsController');

// All routes protected
router.use(auth);

// @route   POST /api/projects
router.post('/', createProject);

// @route   GET /api/projects
router.get('/', getProjects);

// @route   GET /api/projects/:id
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;
