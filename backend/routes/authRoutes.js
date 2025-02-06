const express = require('express');
const { register, login, profile ,enrollCourse} = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', profile);
router.post('/enroll', enrollCourse);
module.exports = router;
