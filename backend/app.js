// backend/app.js

// Core modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api'); // API endpoints for multi-tenant Shopify service

// Initialize app
const app = express();

// Enable CORS so frontend can access API
app.use(cors({
  origin: "https://shopify-insights-app-miy7.onrender.com", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Logging middleware
app.use(logger('dev'));

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// Static files (optional, in case you host assets)
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
// Root route (can show API running message)
app.use('/', indexRouter);

// Users route (optional)
app.use('/users', usersRouter);

// API routes (multi-tenant)
app.use('/api', apiRouter); // Example: /api/customers, /api/orders, /api/products, /api/ingest

// Catch 404 and forward to JSON error
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log full error stack
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
