const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./Model/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EduCore';

const seedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin already exists for email: ${adminEmail}`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await Admin.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
      status: 'active',
    });

    console.log(`Admin created successfully for email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
