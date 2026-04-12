const express = require('express');
const config = require('../config/database');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'trackflow-api',
    version: config.api.version,
    timestamp: new Date().toISOString(),
  });
});

router.post('/auth/register', (req, res) => {
  res.status(501).json({
    message: 'Register endpoint not implemented yet.',
    hint: 'Wire controllers in backend/controllers and models in backend/models.',
  });
});

router.post('/auth/login', (req, res) => {
  res.status(501).json({
    message: 'Login endpoint not implemented yet.',
    hint: 'Wire controllers in backend/controllers and models in backend/models.',
  });
});

router.get('/projects', (req, res) => {
  res.status(200).json({
    data: [],
    message: 'Projects list placeholder.',
  });
});

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
