import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner'; // Import the toast function
import Levenshtein from 'levenshtein'; // Import Levenshtein distance package
import '../styles/PracticeModule.css'

const PracticeModule = ({ completedModules, onCompleteModule }) => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenWord, setSpokenWord] = useState('');

  useEffect(() => {
    setQuestions(moduleQuestions[moduleId] || []);
  }, [moduleId]);

  // Function to speak the French word
  const handleSpeakFrenchWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR'; // Set to French
    speechSynthesis.speak(utterance);
  };

  // Start listening for user input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Listening...');
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in speech recognition: ', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setSpokenWord(spokenText);
      console.log('Spoken word: ', spokenText);

      // Log the current word being compared
      console.log("Current word being compared:", questions[currentWordIndex]?.word);

      setIsListening(false);
      handleSpeechComparison(spokenText); // Compare after listening
    };

    recognition.start();
  };

  // Normalize the word by trimming spaces, converting to lowercase, and removing accents
  const normalizeWord = (word) => {
    return word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Remove accents
      .trim(); // Remove spaces or invisible characters
  };

  const handleSpeechComparison = (spokenText) => {
    const correctWord = questions[currentWordIndex]?.word;

    // Normalize both the spoken word and the correct word for comparison
    const normalizedSpokenText = normalizeWord(spokenText);
    const normalizedCorrectWord = normalizeWord(correctWord);

    // Log the words at different points for debugging
    console.log("Original Spoken Text:", spokenText);
    console.log("Normalized Spoken Text:", normalizedSpokenText);
    console.log("Correct Word:", correctWord);
    console.log("Normalized Correct Word:", normalizedCorrectWord);

    // Use Levenshtein distance to allow a tolerance for minor mistakes
    const distance = new Levenshtein(normalizedSpokenText, normalizedCorrectWord);
    const tolerance = 2;  // Set the tolerance level (adjust as necessary)

    if (distance.distance <= tolerance) {
      toast.success('Correct pronunciation! 🎉');
    } else {
      toast.error(`Oops, try again. 😅\n Spoke: "${normalizedSpokenText}", Expected: "${normalizedCorrectWord}"`);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < questions.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setProgress(progress + 20); // Increment progress by 20%
    } else {
      // Complete the module
      toast.success(`You have completed Module ${moduleId}! 🎉`);
      alert('Congratulations! You have completed all questions for Module ' + moduleId + '!');

      // Mark the module as completed
      onCompleteModule(moduleId);

      // Redirect to the quiz for this module
      navigate(`/quiz/${moduleId}`);
    }
  };

  const isModuleUnlocked = true; // All modules are unlocked

  return (
    <div className="practice-container">
      <Toaster position="top-right" richColors />
      <h2>{isModuleUnlocked ? `Practice for Module ${moduleId}` : `Module ${moduleId} Locked`}</h2>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      {isModuleUnlocked ? (
        <div className="word-container">
          <div className="word-card">
            <h3>{questions[currentWordIndex]?.word}</h3>
            <p>{questions[currentWordIndex]?.translation}</p>
            <div className="microphone-container">
              <button
                className="mic-button"
                onClick={() => handleSpeakFrenchWord(questions[currentWordIndex]?.word)}
              >
                🔊
              </button>
              <button
                className="mic-button"
                onClick={startListening}
                disabled={isListening}
              >
                {isListening ? 'Listening...' : '🎤'}
              </button>
            </div>
            <p>{spokenWord && `You said: ${spokenWord}`}</p>
            <button onClick={handleNextWord} className="next-button">
              {currentWordIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      ) : (
        <p>This module is locked. Complete the previous module first.</p>
      )}
    </div>
  );
};


const moduleQuestions = {
  1: [
    { id: 1, word: 'Bonjour', translation: 'Hello' },
    { id: 2, word: 'Merci', translation: 'Thank you' },
    { id: 3, word: 'Au revoir', translation: 'Goodbye' },
    { id: 4, word: 'S\'il vous plaît', translation: 'Please' },
    { id: 5, word: 'Excusez-moi', translation: 'Excuse me' },
  ],
  2: [
    { id: 6, word: 'Chat', translation: 'Cat' },
    { id: 7, word: 'Chien', translation: 'Dog' },
    { id: 8, word: 'Maison', translation: 'House' },
    { id: 9, word: 'Livre', translation: 'Book' },
    { id: 10, word: 'Voiture', translation: 'Car' },
  ],
  3: [
    { id: 11, word: 'Un', translation: 'One' },
    { id: 12, word: 'Deux', translation: 'Two' },
    { id: 13, word: 'Trois', translation: 'Three' },
    { id: 14, word: 'Quatre', translation: 'Four' },
    { id: 15, word: 'Cinq', translation: 'Five' },
  ],
  4: [
    { id: 16, word: 'Mère', translation: 'Mother' },
    { id: 17, word: 'Père', translation: 'Father' },
    { id: 18, word: 'Frère', translation: 'Brother' },
    { id: 19, word: 'Sœur', translation: 'Sister' },
    { id: 20, word: 'Grand-mère', translation: 'Grandmother' },
  ],
  5: [
    { id: 21, word: 'Pain', translation: 'Bread' },
    { id: 22, word: 'Fromage', translation: 'Cheese' },
    { id: 23, word: 'Pomme', translation: 'Apple' },
    { id: 24, word: 'Poisson', translation: 'Fish' },
    { id: 25, word: 'Légume', translation: 'Vegetable' },
  ],
  6: [
    { id: 26, word: 'Rouge', translation: 'Red' },
    { id: 27, word: 'Bleu', translation: 'Blue' },
    { id: 28, word: 'Vert', translation: 'Green' },
    { id: 29, word: 'Jaune', translation: 'Yellow' },
    { id: 30, word: 'Noir', translation: 'Black' },
  ],
  7: [
    { id: 31, word: 'Gauche', translation: 'Left' },
    { id: 32, word: 'Droite', translation: 'Right' },
    { id: 33, word: 'Tout droit', translation: 'Straight ahead' },
    { id: 34, word: 'Derrière', translation: 'Behind' },
    { id: 35, word: 'Devant', translation: 'In front' },
  ],
  8: [
    { id: 36, word: 'Soleil', translation: 'Sun' },
    { id: 37, word: 'Pluie', translation: 'Rain' },
    { id: 38, word: 'Neige', translation: 'Snow' },
    { id: 39, word: 'Nuage', translation: 'Cloud' },
    { id: 40, word: 'Vente', translation: 'Wind' },
  ],
  9: [
    { id: 41, word: 'Comment ça va?', translation: 'How are you?' },
    { id: 42, word: 'Je vais bien', translation: 'I am fine' },
    { id: 43, word: 'Merci beaucoup', translation: 'Thank you very much' },
    { id: 44, word: 'Excusez-moi', translation: 'Excuse me' },
    { id: 45, word: 'Je suis désolé', translation: 'I am sorry' },
  ],
  10: [
    { id: 46, word: 'École', translation: 'School' },
    { id: 47, word: 'Parc', translation: 'Park' },
    { id: 48, word: 'Magasin', translation: 'Shop' },
    { id: 49, word: 'Bureau', translation: 'Office' },
    { id: 50, word: 'Restaurant', translation: 'Restaurant' },
  ],
};

export default PracticeModule;
