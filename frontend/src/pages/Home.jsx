import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Home.css';
import spanish from '../assets/spanish.jpeg' // Import your CSS

// Sample Data for Enrolled and Available Courses
const availableCourses = [
  { id: "64b8f2c3e4b0d2f431bc1d98", name: 'German', description: 'Start learning German today.', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg' },
  { id: "64b8f2c3e4b0d2f431bc1d99", name: 'Italian', description: 'Explore the beauty of the Italian language.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg' },
  { id: "67337c79ee08e500dad7eae7", name: 'French', description: 'A comprehensive course for learning French.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg' },
  { id: "67337c79ee08e500dad7eae6", name: 'Spanish', description: 'Learn Spanish from beginner to advanced level.', imageUrl: spanish },

];

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Handle "Start Learning" button click
  const handleStartLearning = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Please log in first');
      navigate('/login'); // Redirect to login page if not logged in
      return;
    }
  
    try {
      // Make the API call to enroll in the course
      const response = await axios.post('http://localhost:5000/api/auth/enroll', {
        courseId: selectedCourse.id  // Send selected course id (ObjectId)
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in header
        }
      });
  
      alert(response.data.message);  // Display success message
      setShowModal(false);  // Close the modal
      setFormData({ name: '', email: '' });  // Clear the form
      navigate('/lessons');  // Redirect to lessons page after enrollment
    } catch (error) {
      console.error('Enrollment error:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Enrollment failed. Please try again.');
      } else {
        alert('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Language Learning!</h1>
      <p className="home-description">Start your journey to learn a new language today. Choose a course that suits your level and interests.</p>

      <section className="course-section">
        <h2 className="section-title">Available Courses</h2>
        <div className="courses-container">
          {availableCourses.map((course) => (
            <div key={course.id} className="card">
              <div className="image-wrapper">
                <img src={course.imageUrl} alt={`${course.name} course`} />
              </div>
              <h3 className="card-title">{course.name}</h3>
              <p className="card-description">{course.description}</p>
              <button className="button" onClick={() => handleStartLearning(course)}>
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Enrollment Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enroll in {selectedCourse.name}</h2>
            <form onSubmit={handleEnroll}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              <button type="submit" className="button">Start Learning</button>
              <button type="button" className="button cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
