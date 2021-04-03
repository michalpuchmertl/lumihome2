#!/usr/bin/env node
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const emoji = require('node-emoji');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/error');
const path = require('path');
dotenv.config({ path: './config/config.env' });

connectDB();

// Import routers
const debts = require('./routes/debts');
const categories = require('./routes/categories');
const transactions = require('./routes/transactions');
const auth = require('./routes/auth');

const app = express();

app.use(express.static('./public'));

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cookie parser
// app.use(cookieParser());

// Mount routers
app.use('/api/v1/debts', debts);
app.use('/api/v1/categories', categories);
app.use('/api/v1/transactions', transactions);
app.use('/api/v1/auth', auth);

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname) + '/public/index.html');
});
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `${emoji.get('rocket')} Server running in ${
      process.env.NODE_ENV
    } mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.bgRed.white.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
