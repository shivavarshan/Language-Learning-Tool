import React, { useState } from 'react';
import { FaVolumeUp, FaArrowRight, FaLanguage } from 'react-icons/fa';
import '../styles/Speech.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Speech = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setTranslation(null);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText) {
      setError('Please enter a word.');
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Translate the word "${inputText}" to ${selectedLanguage}. Just give a single and best translation alone.`;
      const result = await model.generateContent(prompt);
      const translatedText = result.response.text(); 

      setTranslation({ translation: translatedText });
      setHistory((prevHistory) => [
        { word: inputText, translatedText },
        ...prevHistory,
      ]);
      
      speak(translatedText, selectedLanguage);
    } catch (err) {
      setError('Error translating the word. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text, language) => {
    if (!window.speechSynthesis) {
      setError('Speech synthesis is not supported in your browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const languageMap = {
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
    };

    utterance.lang = languageMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleHistory = () => {
    setHistoryVisible(!isHistoryVisible);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container">

      <div className="language-selector">
        <label htmlFor="language">Select Language: <FaLanguage /></label>
        <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="fr">French 🇫🇷</option>
          <option value="de">German 🇩🇪</option>
          <option value="ja">Japanese 🇯🇵</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter an English word"
          className="input-field"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span>Translating... <FaArrowRight className="loading-icon" /></span> : 'Translate'}
        </button>
      </form>
      {error && <div className="error-message">{error} <span role="img" aria-label="error">⚠️</span></div>}

      {translation && (
        <div className="translation-result">
          <h2>Translation: {translation.translation} <span role="img" aria-label="check">✅</span></h2>
          <button onClick={() => speak(translation.translation, selectedLanguage)} className="speak-btn">
            <FaVolumeUp /> Speak
          </button>
        </div>
      )}

      <button onClick={toggleHistory} className="history-toggle-btn">
        {isHistoryVisible ? 'Hide History' : 'Show History'} <span role="img" aria-label="history">📜</span>
      </button>

      {isHistoryVisible && (
        <div className="history-section">
          <button onClick={handleClearHistory} className="clear-history-btn">
            Clear History <span role="img" aria-label="trash">🗑️</span>
          </button>
          <h3>Translation History:</h3>
          <ul className="history-list">
            {history.map((entry, index) => (
              <li key={index}>
                <strong>{entry.word}</strong>: {entry.translatedText} <span role="img" aria-label="language">🌐</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Speech;
