const express = require('express');
const config = require('../config/database');
const authRoutes = require('./auth');
const projectRoutes = require('./projects');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'trackflow-api',
    version: config.api.version,
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

router.get('/stories', (req, res) => {
  res.status(200).json({
    data: [],
    message: 'Stories list placeholder.',
  });
});

router.get('/teams', (req, res) => {
  res.status(200).json({
    data: [],
    message: 'Teams list placeholder.',
  });
});

module.exports = router;
