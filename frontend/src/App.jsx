import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Register';
import './App.css';
import Practice from './components/Practice';
import LandingPage from './pages/LandingPage';
import Lesson from './components/Lesson';
import Quiz from './components/Quiz';
import PracticeModule from './components/PracticeModule';
import Enroll from './components/Enroll';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [completedModules, setCompletedModules] = useState(new Set()); 
  const [scores, setScores] = useState(Array(10).fill(0)); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const storedCompletedModules = JSON.parse(localStorage.getItem('completedModules')) || [];
    setCompletedModules(new Set(storedCompletedModules));

    const storedScores = JSON.parse(localStorage.getItem('scores')) || Array(10).fill(0);
    setScores(storedScores);
  }, []);

  const handleCompleteModule = (moduleId) => {
    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(parseInt(moduleId)); 
    setCompletedModules(newCompletedModules);
  
    localStorage.setItem('completedModules', JSON.stringify(Array.from(newCompletedModules)));
  };
  

  return (
    <Router>
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/practice" element={isAuthenticated ? <Practice /> : <Navigate to="/login" />} />
        <Route path="/lessons" element={isAuthenticated ? <Lesson /> : <Navigate to="/login" />} />
        <Route path='/enroll' element={<Enroll/>}/>
        <Route path="/practices/:moduleId" element={isAuthenticated ? <PracticeModule onCompleteModule={handleCompleteModule} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/quiz/:moduleId" 
          element={isAuthenticated ? <Quiz onComplete={handleCompleteModule} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
