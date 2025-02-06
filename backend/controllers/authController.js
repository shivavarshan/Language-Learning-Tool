const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
};
// Login route
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token with the user ID (or any other relevant data you want to store)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user info (excluding password)
    res.json({
      token,
      user: {
        id: user._id,        // Send user ID to frontend
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// controllers/authController.js

exports.profile = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include enrolledCourses in the response
    res.json({ user, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.enrollCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  console.log("I am from backendddd...")
  if (!courseId || !userId) {
    return res.status(400).json({ error: 'Course ID and User ID are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already enrolled in the course
    const isEnrolled = user.enrolledCourses.some(course => course.courseId.toString() === courseId);
    if (isEnrolled) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Add the course to the enrolledCourses array
    user.enrolledCourses.push({ courseId, enrolledDate: new Date() });
    await user.save();

    res.status(200).json({ message: 'Successfully enrolled in the course', enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};