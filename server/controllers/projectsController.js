const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects for the user
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ members: req.user._id });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, members: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const updates = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found or not owner' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found or not owner' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}; 