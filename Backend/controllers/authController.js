const User = require('../Model/User');
const Admin = require('../Model/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.registerSocietyLeader = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingAdmin = await Admin.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Society leader email already registered.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const societyLeader = await Admin.create({
            email: normalizedEmail,
            passwordHash,
            role: 'society_leader',
            status: 'active',
        });

        return res.status(201).json({
            message: 'Society leader account created successfully',
            user: {
                id: societyLeader._id,
                email: societyLeader.email,
                role: societyLeader.role,
                status: societyLeader.status,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (admin.status !== 'active') {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        res.json({
            token,
            user: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};