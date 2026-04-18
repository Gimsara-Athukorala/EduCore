const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EduCore';
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Also increase URL-encoded limit
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const eventRoutes = require('./Routes/eventRoutes');
const lostItemRoutes = require('./Routes/lostItemRoutes');
const foundItemRoutes = require('./Routes/foundItemRoutes');
const claimRoutes = require('./Routes/claimRoutes');
const adminRoutes = require('./Routes/adminRouteslostFound');
const authRoutes = require('./Routes/authRoutes');
const societyRoutes = require('./Routes/societyRoutes');

app.use('/api/events', eventRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/societies', societyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EduCore LMS API is running',
    database: 'MongoDB Connected',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: MongoDB Connected`);
    console.log(`🎯 API: http://localhost:${PORT}`);
    console.log(`📝 Ready to handle event management operations\n`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
