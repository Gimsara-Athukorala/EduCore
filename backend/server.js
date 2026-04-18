const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');

app.use('/api', authRoutes); // This makes /api/login, /api/register
app.use('/api/materials', materialRoutes); // This makes /api/materials/

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));