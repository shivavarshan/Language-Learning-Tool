import React, { useState } from 'react';
import axios from 'axios';

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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText) {
      setError('Please enter a word.');
      return;
    }

    try {
      // Detect language of the input text
      const detectLanguageResponse = await axios({
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/detect',
        headers: {
          'x-rapidapi-key': '514915398emshb8cf2b9c6a00e71p1840b1jsn9b820c9404b7',  // Your RapidAPI key here
          'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
          'Accept-Encoding': 'application/gzip',
        },
        data: new URLSearchParams({ q: inputText }), // Detect language
      });

      const detectedLanguage = detectLanguageResponse.data.data.detections[0][0].language;

      // Now translate the word to the selected language
      const translateResponse = await axios({
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'x-rapidapi-key': '514915398emshb8cf2b9c6a00e71p1840b1jsn9b820c9404b7',  // Your RapidAPI key here
          'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
          'Accept-Encoding': 'application/gzip',
        },
        data: new URLSearchParams({
          q: inputText,
          target: selectedLanguage,  // Target language code (e.g., 'fr' for French)
          source: detectedLanguage,  // Detected language
        }),
      });

      const translatedText = translateResponse.data.data.translations[0].translatedText;

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
    utterance.lang = language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'ja-JP';
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


/*, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}*/ 