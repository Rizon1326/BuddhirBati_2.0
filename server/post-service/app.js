////backend/post-service/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes'); // Ensure this file exists and is correctly implemented
const cors = require('cors');
// Configure environment variables
dotenv.config();

// Create an Express application
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5004', 'http://localhost:5003', 'http://localhost:5002', 'http://localhost:8000',],
    // origin: true,
    credentials: true,
  };
app.use(cors(corsOptions));


// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// MongoDB connection
const dbURI = process.env.DataBase; // Ensure DataBase is defined in your .env file
if (!dbURI) {
  console.error('Error: Missing MongoDB connection string in .env file (DataBase variable).');
  // process.exit(1); // Exit the application if DataBase is missing
}

mongoose.connect(dbURI)
  .then(() => console.log('Post Service: Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the application if the connection fails
  });

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Post Service running on port ${PORT}`);
});
