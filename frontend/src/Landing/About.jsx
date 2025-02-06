import React, { useState, useEffect } from "react";
import slide from '../assets/slider.webp'; // Your constant image

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Interactive Exercises",
      description: "Engage with interactive exercises that help you practice your skills in a fun, immersive way.",
      image: slide
    },
    {
      title: "Real-Time Conversations",
      description: "Chat with native speakers in real time to improve your pronunciation and fluency.",
      image: slide
    },
    {
      title: "Language Mastery Tools",
      description: "Use advanced tools and features designed to accelerate your language learning journey.",
      image: slide
    }
  ];

  // Automatic slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="aboutSection">
      <h2 className="sectionHeading">About Us</h2>
      <p className="sectionDescription">
        LinguaMaster is an innovative platform designed to help you master new languages. Our lessons, exercises, and real-time conversations ensure you achieve fluency in multiple languages.
      </p>

      <div className="sliderContainer">
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              <div className="imageWrapper">
                <img src={slide.image} alt={slide.title} className="slideImage" />
                <div className="overlay"></div>
              </div>
              <div className="slideContent">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
