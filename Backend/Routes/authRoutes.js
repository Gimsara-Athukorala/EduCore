const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, registerLeader } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/register-leader', registerLeader);

module.exports = router;
