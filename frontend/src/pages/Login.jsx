import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import '../styles/Forms.css';
import image1 from '../assets/image-1.png';
import image2 from '../assets/image-2.png';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    try {
      // Make the login request
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Debug the response from the backend
      console.log('Backend Response:', data);  // Check the full response object

      if (data && data.token && data.user) {
        // Store the token and user ID in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);

        // Debugging: Check if the userId is being correctly stored
        console.log('Stored userId in localStorage:', localStorage.getItem('userId'));
        
        // Update authentication state
        setIsAuthenticated(true);
        toast("Login successful! 😊");
        
        // Redirect to home page
        navigate('/home');
      } else {
        setErrorMessage('Unexpected response format');
      }
    } catch (error) {
      // Handle errors and show an error message
      setErrorMessage(error.response?.data?.error || 'Login failed');
      console.error('Login failed', error);
    }
  };
  
  // Inline styles for layout (same as Register form)
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
          <h3 style={headingStyle}>Login</h3>

          <div style={formHolderStyle}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-envelope" style={iconStyle}></i>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={formHolderStyle}>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={iconStyle}></i>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}

          <div style={loginLinkStyle}>
            Not a member? <Link to="/register">Signup now</Link>
          </div>
        </form>
        <img src={image2} alt="Decoration 2" className="image-2" style={{ position: 'absolute', bottom: '0', right: '-129px' }} />
      </div>
    </div>
  );
};

export default Login;
