const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize the Express app (ප්‍රධානම පියවර!)
const app = express();

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow reading JSON data

// 1. Setup Uploads Directory
const uploadDir = path.join(__dirname, 'uploads');

// Create the 'uploads' folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Make the 'uploads' folder public so frontend can view files
app.use('/uploads', express.static(uploadDir));

// 2. Import Database Models
const User = require('./models/User');
const Material = require('./models/Material');

// 3. Configure Multer for local file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create a clean unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// 4. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error: ", err));


// ==========================================
// AUTHENTICATION ROUTES (Login & Register)
// ==========================================

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


// ==========================================
// STUDY MATERIALS ROUTES (CRUD & File Uploads)
// ==========================================

// 1. CREATE: Upload new material (Handles File or URL)
app.post('/api/materials', upload.single('file'), async (req, res) => {
    try {
        const { module, title, materialType, uploadMethod, description, url } = req.body;
        let fileUrl = '';

        if (uploadMethod === 'file') {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
            fileUrl = `/uploads/${req.file.filename}`;
        } else {
            if (!url) return res.status(400).json({ message: 'URL is required' });
            fileUrl = url;
        }

        const newMaterial = new Material({
            module,
            title,
            materialType,
            uploadMethod,
            fileUrl,
            description
        });

        await newMaterial.save();
        res.status(201).json({ message: 'Material uploaded successfully', material: newMaterial });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// 2. READ: Get all materials
app.get('/api/materials', async (req, res) => {
    try {
        const materials = await Material.find().sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// 3. DELETE: Delete a material
app.delete('/api/materials/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });

        // If it was a local file, delete it from the server
        if (material.uploadMethod === 'file' && material.fileUrl.startsWith('/uploads')) {
            const filePath = path.join(__dirname, material.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// 4. UPDATE: Update material details (Title and Description)
app.put('/api/materials/:id', async (req, res) => {
    try {
        const { title, description, materialType } = req.body;
        
        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id,
            { title, description, materialType },
            { new: true } // Return the updated document
        );

        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json({ message: 'Material updated successfully', material: updatedMaterial });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});