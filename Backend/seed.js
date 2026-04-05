const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('./Model/eventModel');
const User = require('./Model/userModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

const testEvents = [
  {
    title: 'Introduction to React',
    description: 'Learn the basics of React including components, props, and state management.',
    startDate: new Date('2024-03-25T10:00:00'),
    endDate: new Date('2024-03-25T12:00:00'),
    location: 'Room 101, Building A',
    organizer: 'Dr. Sarah Johnson',
    category: 'academicEvent',
    attendees: ['John Doe', 'Jane Smith', 'Bob Wilson'],
    status: 'scheduled'
  },
  {
    title: 'Node.js Workshop',
    description: 'Hands-on workshop covering Node.js, Express.js, and REST API development.',
    startDate: new Date('2024-04-01T14:00:00'),
    endDate: new Date('2024-04-01T16:00:00'),
    location: 'Lab 5, Building B',
    organizer: 'Prof. Mike Chen',
    category: 'workshop',
    attendees: ['Alice Johnson', 'Charlie Brown', 'Diana Martinez', 'Edward Lee'],
    status: 'scheduled'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Clear existing events (optional - comment out if you want to keep existing data)
    // await Event.deleteMany({});
    // console.log('Cleared existing events');

    // Insert test events
    const createdEvents = await Event.insertMany(testEvents);
    
    console.log('\n✅ Test events created successfully:\n');
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Category: ${event.category}`);
      console.log(`   Start: ${event.startDate.toLocaleString()}`);
      console.log(`   End: ${event.endDate.toLocaleString()}`);
      console.log(`   Organizer: ${event.organizer}`);
      console.log(`   Attendees: ${event.attendees.join(', ')}`);
      console.log(`   ID: ${event._id}\n`);
    });

    // Ensure first admin exists by seed
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234!';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`\n✅ Initial admin created (email=${adminEmail}, password=${adminPassword})`);
    } else {
      console.log('\nℹ️ Admin user already exists, no admin seed needed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
