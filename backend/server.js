const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');
const apiRoutes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'TrackFlow Backend',
    status: 'ok',
    version: config.api.version,
    docs: `${config.api.prefix}/health`,
  });
});

app.use(config.api.prefix, apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: err.message || 'Something went wrong.',
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection failed. Running without DB.');
    console.warn(error.message);
  }

  app.listen(config.server.port, () => {
    console.log(`API listening on http://localhost:${config.server.port}${config.api.prefix}`);
  });
};

startServer();
