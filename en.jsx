import React, { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Gemini SDK

const Speech = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [isHistoryVisible, setHistoryVisible] = useState(false);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setTranslation(null); // Reset translation when language changes
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError(''); // Reset any error message on new input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText) {
      setError('Please enter a word.');
      return;
    }

    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI('AIzaSyCJLR-WA7DsCAe522RmD-hNPzwtzFfefrg'); // Replace with your actual API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Use Gemini API to generate translation
      const prompt = `Translate "${inputText}" to ${selectedLanguage}.`;
      const result = await model.generateContent(prompt);

      // Gemini API's response text (ensure correct response structure)
      const translatedText = result.response.text || result.response; // Accessing the text property

      setTranslation({ translation: translatedText });
      setHistory((prevHistory) => [
        { word: inputText, translatedText },
        ...prevHistory,
      ]);

      speak(translatedText, selectedLanguage);
    } catch (err) {
      setError('Error translating the word. Please try again later.');
      console.error('API Error:', err);
    }
  };

  const speak = (text, language) => {
    if (!window.speechSynthesis) {
      setError('Speech synthesis is not supported in your browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Dynamic language selection for speech synthesis
    const languageMap = {
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
    };

    utterance.lang = languageMap[language] || 'en-US'; // Default to English if not found
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
      <h1>Word Translation App</h1>

      {/* Language Selector */}
      <div className="language-selector">
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {/* Translation Input */}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter an English word"
          className="input-field"
        />
        <button type="submit" className="submit-btn">Translate</button>
      </form>
      {error && <div className="error-message">{error}</div>}

      {/* Translation Result */}
      {translation && (
        <div className="translation-result">
          <h2>Translation: {translation.translation}</h2>
          <button onClick={() => speak(translation.translation, selectedLanguage)} className="speak-btn">
            Speak
          </button>
        </div>
      )}

      {/* History Toggle */}
      <button onClick={toggleHistory} className="history-toggle-btn">
        {isHistoryVisible ? 'Hide History' : 'Show History'}
      </button>

      {/* Translation History */}
      {isHistoryVisible && (
        <div className="history-section">
          <button onClick={handleClearHistory} className="clear-history-btn">
            Clear History
          </button>
          <h3>Translation History:</h3>
          <ul className="history-list">
            {history.map((entry, index) => (
              <li key={index}>
                <strong>{entry.word}</strong>: {entry.translatedText}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Speech;
