import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lesson.css'
 // Import custom CSS for styling

const Lesson = () => {
    const [completedModules, setCompletedModules] = useState(0);
    const [scores, setScores] = useState(Array(10).fill(0));
    const navigate = useNavigate();

    // Add emojis in descriptions
    const moduleDescriptions = [
        "In this module, you'll learn essential French words for daily interactions. These include greetings like 'Hello' (Bonjour) and polite phrases such as 'Excuse me' (Excusez-moi) and 'Please' (S'il vous plaît). 🌟🗣️",
        "This module focuses on animals. You'll learn the French names for common animals, such as 'Cat' (Chat), 'Dog' (Chien), and 'Car' (Voiture). 🐱🐶🚗",
        "Here, you'll learn the basic French numbers from one to five. Get familiar with the words 'One' (Un), 'Two' (Deux), 'Three' (Trois), 'Four' (Quatre), and 'Five' (Cinq). 🔢✋",
        "In this module, you'll learn how to refer to family members in French. Words like 'Mother' (Mère), 'Father' (Père), 'Brother' (Frère), and 'Sister' (Sœur) are covered. 👪❤️",
        "This module introduces food-related vocabulary in French. You will learn the names of common foods and drinks like 'Bread' (Pain), 'Cheese' (Fromage), 'Apple' (Pomme), and 'Fish' (Poisson). 🍞🧀🍏🐟",
        "In this module, you'll discover how to describe colors in French. Words like 'Red' (Rouge), 'Blue' (Bleu), 'Green' (Vert), and 'Black' (Noir) are covered. 🌈🎨",
        "This module focuses on giving directions in French. You’ll learn words for essential directions like 'Left' (Gauche), 'Right' (Droite), and 'Straight ahead' (Tout droit). 🧭➡️⬅️",
        "This module introduces weather-related vocabulary in French. You'll learn how to describe weather conditions like 'Sun' (Soleil), 'Rain' (Pluie), 'Snow' (Neige), and 'Wind' (Vente). 🌞🌧️❄️💨",
        "In this module, you'll practice essential conversational phrases in French. Learn how to say 'How are you?' (Comment ça va?) and 'I am sorry' (Je suis désolé), as well as polite expressions like 'Excuse me' (Excusez-moi). 💬🙏",
        "In this module, you will learn French vocabulary for different places. Words like 'School' (École), 'Park' (Parc), 'Shop' (Magasin), and 'Restaurant' (Restaurant) will help you navigate common locations in French-speaking environments. 🏫🌳🍴"
    ];

    const handleStartPractice = (module) => {
        navigate(`/practices/${module}`);
    };

    return (
        <div className="lesson-container">
            <h2>Language Learning Modules</h2>
            <div className="modules-container">
                {Array.from({ length: 10 }, (_, index) => (
                    <div
                        key={index}
                        className={`module ${index < completedModules ? 'unlocked' : 'locked'}`}
                    >
                        <h3>Module {index + 1}</h3>
                        <p>{moduleDescriptions[index]}</p>
                        
                        <button onClick={() => handleStartPractice(index + 1)} className="start-button">
                            Practice
                        </button>
                        {scores[index] > 0 && <p>Score: {scores[index]}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Lesson;
