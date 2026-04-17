const jwt = require('jsonwebtoken');
const Admin = require('../Model/Admin');

const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing bearer token',
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: invalid token',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(payload.adminId).select('-passwordHash');
    if (!admin || admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: admin account not active',
      });
    }

    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: token verification failed',
    });
  }
};

module.exports = {
  requireAdminAuth,
};
