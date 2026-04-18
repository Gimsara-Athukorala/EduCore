const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
const authRoutes = require('./Routes/authRoutes');
const materialRoutes = require('./Routes/materialRoutes');
const societyRoutes = require('./Routes/societyRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const lostItemRoutes = require('./Routes/lostItemRoutes');
const foundItemRoutes = require('./Routes/foundItemRoutes');
const claimRoutes = require('./Routes/claimRoutes');
const adminRoutesLostFound = require('./Routes/adminRouteslostFound');

// Mount routes with appropriate paths
app.use('/api', authRoutes); // This makes /api/login, /api/register
app.use('/api/materials', materialRoutes); // This makes /api/materials/
app.use('/api/societies', societyRoutes); // This makes /api/societies/
app.use('/api/events', eventRoutes); // This makes /api/events/
app.use('/api/lost-items', lostItemRoutes); // This makes /api/lost-items/
app.use('/api/found-items', foundItemRoutes); // This makes /api/found-items/
app.use('/api/claims', claimRoutes); // This makes /api/claims/
app.use('/api/admin/lost-found', adminRoutesLostFound); // This makes /api/admin/lost-found/

// Error Handler Middleware (must be last)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));