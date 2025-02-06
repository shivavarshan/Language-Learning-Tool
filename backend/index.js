const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/lang')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      enrolledDate: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', userSchema);


const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true }
});

const Course = mongoose.model('Course', courseSchema);


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    req.userId = decoded.userId;
    next();
  });
};


app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'User registration failed' });
  }
});


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});


app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('enrolledCourses.courseId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

app.post('/api/auth/enroll', verifyToken, async (req, res) => {
  const { courseId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ success: false, message: 'Invalid course ID' });
  }

  try {

    const user = await User.findById(req.userId);

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isEnrolled = user.enrolledCourses.some(
      (enrollment) => enrollment.courseId.toString() === courseId
    );

    if (isEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }

    user.enrolledCourses.push({ courseId });
    await user.save();

    return res.status(200).json({ success: true, message: 'Enrolled successfully!' });

  } catch (error) {
    console.error('Enrollment error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Enrollment failed. Please try again.' });
    }
  }
});


app.post('/api/courses', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCourse = new Course({ name, description });
    await newCourse.save();
    res.status(201).json({ success: true, message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ success: false, message: 'Course creation failed' });
  }
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
