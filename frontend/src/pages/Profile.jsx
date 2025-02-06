import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

// Example user data (static)
const staticUserData = {
  avatar: "https://www.w3schools.com/howto/img_avatar.png",
  progress: 75, // Overall progress in learning
  languages: [
    { name: "French", level: "Beginner", progress: 65 },
    { name: "German", level: "Intermediate", progress: 45 },
    { name: "Spanish", level: "Advanced", progress: 85 }
  ],
  completedLessons: 30,
  totalLessons: 50
};

const Profile = () => {
  const [user, setUser] = useState(null); // Store fetched user data (name, email)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  const [dob, setDob] = useState(''); // Date of birth state
  const [phone, setPhone] = useState(''); // Phone number state
  const [gender, setGender] = useState(''); // Gender state
  const [age, setAge] = useState(null); // Age state
  const [isEditable, setIsEditable] = useState(false); // To enable save/update

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token not found. Please log in.");
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
        console.log(data)
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchProfile();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setDob(dobValue);
    if (dobValue) {
      setAge(calculateAge(dobValue));
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSave = () => {
    if (dob && phone && gender && age) {
      setIsEditable(false);
    } else {
      alert("Please fill all the details correctly!");
    }
  };

  const handleUpdate = () => {
    setIsEditable(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return user ? (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={staticUserData.avatar} alt="Avatar" className="profile-avatar" />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="profile-card">
        <h3>Your Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${staticUserData.progress}%` }}></div>
        </div>
        <p>{staticUserData.progress}% Complete</p>
      </div>

      <div className="profile-card">
        <h3>Languages Learned</h3>
        {staticUserData.languages.map((language, index) => (
          <div key={index} className="language-card">
            <h4>{language.name}</h4>
            <p>Level: {language.level}</p>
            <div className="language-progress-bar">
              <div className="progress-bar" style={{ width: `${language.progress}%` }}></div>
            </div>
            <p>{language.progress}% Progress</p>
          </div>
        ))}
      </div>

      <div className="profile-card">
        <h3>Lessons</h3>
        <p>{staticUserData.completedLessons} of {staticUserData.totalLessons} lessons completed.</p>
        <div className="lesson-progress-bar">
          <div className="progress-bar" style={{ width: `${(staticUserData.completedLessons / staticUserData.totalLessons) * 100}%` }}></div>
        </div>
      </div>

      <div className="profile-card">
        <h3>Personal Information</h3>
        <form>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={handleDobChange}
              disabled={!isEditable}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              disabled={!isEditable}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div>
              <label htmlFor="male">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={gender === 'Male'}
                  onChange={handleGenderChange}
                  disabled={!isEditable}
                />
                Male
              </label>
              <label htmlFor="female">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={gender === 'Female'}
                  onChange={handleGenderChange}
                  disabled={!isEditable}
                />
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="text"
              value={age || ''}
              readOnly
              placeholder="Age will be calculated"
            />
          </div>

          {!isEditable ? (
            <button type="button" onClick={handleUpdate} className="btn update-btn">
              Update
            </button>
          ) : (
            <button type="button" onClick={handleSave} className="btn save-btn">
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  ) : (
    <div>No user data available.</div>
  );
};

export default Profile;


