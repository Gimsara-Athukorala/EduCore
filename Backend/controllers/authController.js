const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../Model/Admin');

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('Admin register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during admin registration',
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      }
    );

    admin.lastLogin = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during admin login',
      error: error.message,
    });
  }
};

const registerLeader = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const leader = await Admin.create({
      email: normalizedEmail,
      passwordHash,
      role: 'society_leader',
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Society leader created successfully',
      data: {
        id: leader._id,
        email: leader.email,
        role: leader.role,
        status: leader.status,
      },
    });
  } catch (error) {
    console.error('Society leader register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during society leader registration',
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  registerLeader,
  loginAdmin,
};
