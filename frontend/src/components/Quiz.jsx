import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner'; 

// Quiz Data
const quizData = {
    1: [
        {
            question: "What is the French word for 'hello'?",
            options: ["va", "Hola", "Hallo", "Ciao"],
            correct: "Bonjour"
        },
        {
            question: "What is the French word for 'thank you'?",
            options: ["Gracias", "Merci", "Danke", "Grazie"],
            correct: "Merci"
        },
    ],
    2: [
        {
            question: "What is the French word for 'goodbye'?",
            options: ["Adieu", "Hasta Luego", "Auf Wiedersehen", "Addio"],
            correct: "Adieu"
        },
        {
            question: "What is the French word for 'please'?",
            options: ["Por Favor", "S'il Vous Plaît", "Bitte", "Per Favore"],
            correct: "S'il Vous Plaît"
        },
    ],
    3: [
        {
            question: "What is the French word for 'thank you very much'?",
            options: ["Merci Beaucoup", "Muchas Gracias", "Grazie Mille", "Danke Sehr"],
            correct: "Merci Beaucoup"
        },
        {
            question: "What is the French word for 'good night'?",
            options: ["Bonne Nuit", "Buena Noche", "Gute Nacht", "Notte"],
            correct: "Bonne Nuit"
        },
    ],
    4: [
        {
            question: "What is the French word for 'good morning'?",
            options: ["Bonjour", "Guten Morgen", "Buenos Días", "Bom Dia"],
            correct: "Bonjour"
        },
        {
            question: "What is the French word for 'sorry'?",
            options: ["Lo siento", "Désolé", "Es tut mir leid", "Scusa"],
            correct: "Désolé"
        },
    ],
    5: [
        {
            question: "What is the French word for 'cat'?",
            options: ["Chien", "Chat", "Coche", "Cane"],
            correct: "Chat"
        },
        {
            question: "What is the French word for 'dog'?",
            options: ["Perro", "Chien", "Hund", "Cane"],
            correct: "Chien"
        },
    ],
    6: [
        {
            question: "What is the French word for 'house'?",
            options: ["Maison", "Casa", "Haus", "Casa"],
            correct: "Maison"
        },
        {
            question: "What is the French word for 'car'?",
            options: ["Voiture", "Auto", "Wagen", "Coche"],
            correct: "Voiture"
        },
    ],
    7: [
        {
            question: "What is the French word for 'family'?",
            options: ["Familia", "Famille", "Familie", "Famiglia"],
            correct: "Famille"
        },
        {
            question: "What is the French word for 'friend'?",
            options: ["Amigo", "Ami", "Freund", "Amico"],
            correct: "Ami"
        },
    ],
    8: [
        {
            question: "What is the French word for 'school'?",
            options: ["Escuela", "École", "Schule", "Scuola"],
            correct: "École"
        },
        {
            question: "What is the French word for 'book'?",
            options: ["Libro", "Livre", "Buch", "Libro"],
            correct: "Livre"
        },
    ],
    9: [
        {
            question: "What is the French word for 'teacher'?",
            options: ["Profesor", "Enseignant", "Lehrer", "Insegnante"],
            correct: "Enseignant"
        },
        {
            question: "What is the French word for 'student'?",
            options: ["Estudiante", "Élève", "Schüler", "Studente"],
            correct: "Élève"
        },
    ],
    10: [
        {
            question: "What is the French word for 'food'?",
            options: ["Comida", "Nourriture", "Essen", "Cibo"],
            correct: "Nourriture"
        },
        {
            question: "What is the French word for 'drink'?",
            options: ["Bebida", "Boisson", "Getränk", "Bevanda"],
            correct: "Boisson"
        },
    ],
};

const Quiz = ({ onComplete }) => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const questions = quizData[moduleId] || [];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [message, setMessage] = useState('');

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setAnswerFeedback(null);
    };

    const handleNextQuestion = () => {
        if (selectedOption) {
            const isCorrect = selectedOption === questions[currentQuestionIndex].correct;
            if (isCorrect) setScore(score + 1);

            setAnswerFeedback(isCorrect ? 'correct' : 'incorrect');

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption('');
            } else {
                // Final score
                const finalScore = score + (isCorrect ? 1 : 0);
                setMessage(`Your score is ${finalScore} out of ${questions.length}.`);

                // Notify parent about quiz completion
                if (onComplete) {
                    onComplete(moduleId, finalScore);
                }

                toast.success(`You have completed Module ${moduleId}! 🎉`);

                // Navigate to lessons page after a delay
                setTimeout(() => {
                    navigate('/lessons');
                }, 2000);
            }
        } else {
            setMessage("Please select an option before proceeding.");
        }
    };

    const styles = {
        container: {
            maxWidth: '700px',
            margin: '0 auto',
            padding: '30px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            textAlign: 'center',
            fontSize: '24px',
            color: '#333',
            marginBottom: '20px',
        },
        question: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
        },
        optionsContainer: {
            marginBottom: '30px',
        },
        option: {
            margin: '10px 0',
            padding: '15px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
        },
        selectedOption: {
            backgroundColor: '#d1e7dd',
        },
        correctFeedback: {
            backgroundColor: '#d4edda',
            color: '#155724',
        },
        incorrectFeedback: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
        },
        button: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 20px',
            cursor: 'pointer',
        },
        message: {
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e2e3e5',
            color: '#383d41',
        },
    };

    return (
        <div style={styles.container}>
            <Toaster position="top-right" richColors />
            <h2 style={styles.heading}>Quiz for Module {moduleId}</h2>
            {questions.length > 0 ? (
                <div>
                    <p style={styles.question}>{questions[currentQuestionIndex].question}</p>
                    <div style={styles.optionsContainer}>
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.option,
                                    ...(selectedOption === option ? styles.selectedOption : {}),
                                    ...(answerFeedback ? styles[`${answerFeedback}Feedback`] : {}),
                                }}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>
                    <button
                        style={styles.button}
                        onClick={handleNextQuestion}
                        disabled={!selectedOption}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                    </button>
                    {message && <div style={styles.message}>{message}</div>}
                </div>
            ) : (
                <p>No questions available for this module.</p>
            )}
        </div>
    );
};

export default Quiz;
