const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async (retryCount = 3, delay = 5000) => {
  for (let i = 0; i < retryCount; i++) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`Error connecting to MongoDB (Attempt ${i + 1}/${retryCount}):`, err.message);
      if (i < retryCount - 1) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
