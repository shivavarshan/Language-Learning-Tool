import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import character from '../assets/duolingochar.png'; 
import logo from '../assets/logo.png';
import About from '../Landing/About.jsx'

function LanguageLearningLandingPage() {

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <span className="logoIcon">LM</span> LinguaMaster
        </div>
        <nav className="nav">
          <a href="#home" className="navLink">HOME</a> {/* Home Link */}
          <a href="#courses" className="navLink">COURSES</a>
          <a href="#about" className="navLink">ABOUT</a>
        </nav>
      </header>

      <main className="main" id="home"> {/* Add 'home' ID for navigation */}
        {/* Welcome Section */}
        <section className="textSection" id="welcome">
          <h1 className="heading">
            Welcome to <span className="languageText">LinguaMaster</span>
          </h1>
          <p className="description">
            Discover the world of languages! Join us and start learning with interactive lessons, live practice, and resources to achieve fluency in multiple languages.
          </p>
          <button className="readMoreButton" onClick={handleSubmit}>GET STARTED</button>
        </section>

        {/* Floating Letters Section */}
        <div className="floatingLettersContainer">
          <div className="floatingLetters">
            {/* Character Image */}
            <img src={character} alt="Language character" className="floatingImage" />
            
            {/* French Words with Hover English Translations */}
            <div className="speechBubble bubble1" data-translation="Welcome">Bienvenue</div>
            <div className="speechBubble bubble2" data-translation="to">à</div>
            <div className="speechBubble bubble3" data-translation="learn">apprendre</div>
            <div className="speechBubble bubble4" data-translation="the">le</div>
            <div className="speechBubble bubble5" data-translation="different">différent</div>
            <div className="speechBubble bubble6" data-translation="language">langue</div>
          </div>
        </div>
      </main>

      {/* Courses Section */}
      <section id="courses" className="coursesSection">
        <h2 className="sectionHeading">Our Courses</h2>
        <div className="courseList">
          <div className="courseCard">
            <h3>English</h3>
            <p>Master the world's most widely spoken language with our easy-to-follow lessons.</p>
            <button className="courseButton">Learn More</button>
          </div>
          <div className="courseCard">
            <h3>Spanish</h3>
            <p>Learn the second most spoken language in the world, with real-world application lessons.</p>
            <button className="courseButton">Learn More</button>
          </div>
          <div className="courseCard">
            <h3>French</h3>
            <p>Immerse yourself in the romance language of France and improve your vocabulary.</p>
            <button className="courseButton">Learn More</button>
          </div>
        </div>
      </section>

      <About/>
{/* Footer */}
<footer className="footer">
  <div className="footerContent">
    <span className="copy">&copy; 2024 LinguaMaster. All Rights Reserved.</span>
    <div className="footerSocials">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="socialIcon facebook">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="socialIcon twitter">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="socialIcon linkedin">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="socialIcon instagram">
        <i className="fab fa-instagram"></i>
      </a>
    </div>
  </div>

  <div className="footerContactInfo">
    <p>📞 Phone:+91 1234567890</p>
    <p>📍 Address: 3/7-1 Language Street, abc city, AE Country</p>
    <p>✉️ Email: support@linguamaster.com</p>
  </div>
</footer>



    </div>
  );
}

export default LanguageLearningLandingPage;
