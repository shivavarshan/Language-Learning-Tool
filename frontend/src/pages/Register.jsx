import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import image1 from '../assets/image-1.png'; // Adjust path if needed
import image2 from '../assets/image-2.png'; // Adjust path if needed
import '../styles/Forms.css'; // Import your external CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focused, setFocused] = useState({ name: false, email: false, password: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username: name, email, password });
      toast("Register successful! 😊");
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed');
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inline styles for layout (other than button)
  const wrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#accffe',
  };

  const innerStyle = {
    position: 'relative',
    width: '435px',
  };

  const formStyle = {
    width: '100%',
    position: 'relative',
    zIndex: 9,
    padding: '77px 61px 66px',
    background: '#fff',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
  };

  const headingStyle = {
    textTransform: 'uppercase',
    fontSize: '25px',
    fontFamily: '"Muli-SemiBold"',
    color: '#333',
    letterSpacing: '3px',
    textAlign: 'center',
    marginBottom: '33px',
  };

  const formHolderStyle = {
    position: 'relative',
    marginBottom: '21px',
  };

  const inputStyle = {
    border: 'none',
    borderBottom: '1px solid #e6e6e6',
    display: 'block',
    width: '100%',
    height: '38px',
    background: 'none',
    padding: '3px 42px 0px',
    color: '#666',
    fontFamily: '"Muli-SemiBold"',
    fontSize: '16px',
  };

  const inputFocusedStyle = {
    borderBottom: '1px solid #accffe',
  };

  const iconStyle = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    color: '#666',
  };

  const loginLinkStyle = {
    textAlign: 'center',
    marginTop: '15px',
  };

  const errorMessageStyle = {
    color: 'red',
    textAlign: 'center',
  };

  return (
    <div style={wrapperStyle}>
      <Toaster position="top-right" richColors />
      <div style={innerStyle}>
        <img src={image1} alt="Decoration 1" className="image-1" style={{ position: 'absolute', bottom: '-12px', left: '-191px', zIndex: 99 }} />
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3 style={headingStyle}>New Account?</h3>

          <div style={formHolderStyle}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-user" style={iconStyle}></i>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFocus('name')}
                onBlur={() => handleBlur('name')}
                style={{ ...inputStyle, ...(focused.name ? inputFocusedStyle : {}) }}
                required
              />
            </div>
          </div>

          <div style={formHolderStyle}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-envelope" style={iconStyle}></i>
              <input
                type="email"
                placeholder="Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                style={{ ...inputStyle, ...(focused.email ? inputFocusedStyle : {}) }}
                required
              />
            </div>
          </div>

          <div style={formHolderStyle}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={iconStyle}></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                style={{ ...inputStyle, ...(focused.password ? inputFocusedStyle : {}) }}
                required
              />
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            <span>{isLoading ? 'Signing Up...' : 'Register'}</span>
          </button>

          {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}

          <p style={loginLinkStyle}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
        <img src={image2} alt="Decoration 2" className="image-2" style={{ position: 'absolute', bottom: '0', right: '-129px' }} />
      </div>
    </div>
  );
};

export default Register;
