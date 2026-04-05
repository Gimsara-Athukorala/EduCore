const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const MONGODB_URI = "mongodb+srv://akilauddeepaba2002_db_user:byP2x1opTbCoCabl@cluster0.l8xgdvw.mongodb.net/educore?retryWrites=true&w=majority";
const PORT = 5000;

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
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Also increase URL-encoded limit

// Routes
const eventRoutes = require('./Routes/eventRoutes');
const lostItemRoutes = require('./Routes/lostItemRoutes');
const foundItemRoutes = require('./Routes/foundItemRoutes');
const claimRoutes = require('./Routes/claimRoutes');
const adminRoutes = require('./Routes/adminRouteslostFound');

app.use('/api/events', eventRoutes);
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

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

startServer();
