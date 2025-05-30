// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Debug logs
console.log('📦 MONGO_URI:', process.env.MONGO_URI || 'Not defined');
console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET || 'Not defined');

// Ensure required environment variables are present
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const contactRoutes = require('./routes/contact');
app.use('/api', contactRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
