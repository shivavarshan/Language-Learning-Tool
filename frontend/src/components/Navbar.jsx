import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); 
    navigate("/login"); 
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Font and color styles for the navbar
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#007BFF',
    color: 'white',
    position: 'relative',
    fontFamily: 'Roboto, sans-serif', // Add a professional font
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Slight shadow for a modern look
  };

  const brandStyle = {
    fontSize: '26px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  };

  const hamburgerStyle = {
    display: window.innerWidth <= 768 ? 'flex' : 'none',
    flexDirection: 'column',
    cursor: 'pointer',
    zIndex: 1000, // Ensures hamburger button is above other elements
  };

  const hamburgerLineStyle = {
    width: '25px',
    height: '3px',
    backgroundColor: 'white',
    margin: '4px 0',
  };

  const navLinksStyle = {
    display: window.innerWidth > 768 || isMenuOpen ? 'flex' : 'none',
    listStyle: 'none',
    gap: '25px', // Increased gap for spacing between links
    position: window.innerWidth <= 768 ? 'absolute' : 'static',
    top: window.innerWidth <= 768 ? '50px' : 'auto',
    left: window.innerWidth <= 768 ? '0' : 'auto',
    right: window.innerWidth <= 768 ? '0' : 'auto',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    backgroundColor: window.innerWidth <= 768 ? '#007BFF' : 'transparent',
    padding: window.innerWidth <= 768 ? '10px' : '0',
    boxShadow: window.innerWidth <= 768 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
    zIndex: window.innerWidth <= 768 ? '1000' : 'auto',
  };

  const linkStyle = {
    color: 'white', // Ensures links are white
    textDecoration: 'none',
    padding: '10px 20px', // Increased padding for better click targets
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    fontSize: '16px', // Slightly larger font for readability
  };

  const linkHoverStyle = {
    backgroundColor: '#0056b3', // Darker blue for hover effect
  };

  // Custom hover effect for links
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#0056b3';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  return (
    <nav style={navbarStyle}>
      <div style={brandStyle}>
        <Link to="/home" style={brandStyle}>Language Learning</Link>
      </div>
      <div style={hamburgerStyle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div style={hamburgerLineStyle}></div>
        <div style={hamburgerLineStyle}></div>
        <div style={hamburgerLineStyle}></div>
      </div>
      <ul style={navLinksStyle}>
        <li>
          <Link 
            to="/home" 
            style={linkStyle} 
            onClick={() => setIsMenuOpen(false)} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/lessons" 
            style={linkStyle} 
            onClick={() => setIsMenuOpen(false)} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            Lessons
          </Link>
        </li>
        <li>
          <Link 
            to="/practice" 
            style={linkStyle} 
            onClick={() => setIsMenuOpen(false)} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            Practice
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            style={linkStyle} 
            onClick={() => setIsMenuOpen(false)} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            Profile
          </Link>
        </li>
        {/* Conditionally render Logout button based on isAuthenticated */}
        {isAuthenticated && (
          <li>
            <button
              style={{ 
                ...linkStyle, 
                backgroundColor: 'transparent', 
                border: '1px solid white',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
