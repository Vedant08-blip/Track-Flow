const express = require('express');
const Project = require('../models/Project');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ data: projects });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      owner: req.user.id,
    });
    return res.status(201).json({ data: project });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create project.' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    return res.json({ data: project });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update project.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Project.findOneAndDelete({ _id: id, owner: req.user.id });
    if (!result) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    return res.json({ message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete project.' });
  }
});

module.exports = router;
