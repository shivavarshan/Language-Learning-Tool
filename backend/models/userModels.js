const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  description: String,
  imageUrl: String
});

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
      enrolledDate: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = { User, Course };
