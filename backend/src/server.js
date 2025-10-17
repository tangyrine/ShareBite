const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables from src/.env explicitly
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

// TODO: Add your routes here
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
