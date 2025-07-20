require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'], // Allow both dev ports
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});
app.use(limiter);

// Body parser
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// TODO: Register routes here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/projects', require('./routes/projects'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/analytics', require('./routes/analytics'));

// Error handler
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
