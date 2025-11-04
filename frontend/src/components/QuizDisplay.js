import React, { useState } from 'react';
import styles from './QuizDisplay.module.css';

const QuizDisplay = ({ quizData }) => {
    const [takeQuizMode, setTakeQuizMode] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: answer,
        });
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const calculateScore = () => {
        return quizData.quiz_data.reduce((score, question, index) => {
            return userAnswers[index] === question.answer ? score + 1 : score;
        }, 0);
    };

    const getDifficultyClass = (difficulty) => {
        if (!difficulty) return styles.easy;
        switch (difficulty.toLowerCase()) {
            case 'easy': return styles.easy;
            case 'medium': return styles.medium;
            case 'hard': return styles.hard;
            default: return styles.easy;
        }
    };
    
    // Default View (View Answers)
    if (!takeQuizMode) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>{quizData.title}</h2>
                    <button className={styles.modeButton} onClick={() => setTakeQuizMode(true)}>
                        Take Quiz
                    </button>
                </div>
                <p className={styles.summary}>{quizData.summary}</p>
                
                {quizData.quiz_data.map((q, index) => (
                    <div key={index} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                            <p className={styles.questionText}><strong>{index + 1}.</strong> {q.question}</p>
                            <span className={`${styles.difficulty} ${getDifficultyClass(q.difficulty)}`}>{q.difficulty || 'Easy'}</span>
                        </div>
                        <ul className={styles.optionsList}>
                            {q.options.map((option, i) => (
                                <li key={i} className={option === q.answer ? styles.correctAnswer : ''}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                        <p className={styles.explanation}><strong>Explanation:</strong> {q.explanation}</p>
                    </div>
                ))}
                
                <div className={styles.footer}>
                    <strong>Related Topics:</strong>
                    <div className={styles.topics}>
                        {quizData.related_topics.map(topic => <span key={topic} className={styles.topicTag}>{topic}</span>)}
                    </div>
                </div>
            </div>
        );
    }
    
    // Take Quiz Mode
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{quizData.title} - Quiz Mode</h2>
            </div>
            {submitted && (
                <div className={styles.scoreCard}>
                    <h3>Quiz Complete!</h3>
                    <p>Your score: <strong>{calculateScore()} / {quizData.quiz_data.length}</strong></p>
                </div>
            )}
            
            {quizData.quiz_data.map((q, index) => (
                <div key={index} className={styles.questionCard}>
                    <p className={styles.questionText}><strong>{index + 1}.</strong> {q.question}</p>
                    <div className={styles.quizOptions}>
                        {q.options.map((option, i) => {
                            let optionClass = styles.quizOption;
                            if (submitted) {
                                if (option === q.answer) {
                                    optionClass += ` ${styles.correctAnswer}`;
                                } else if (userAnswers[index] === option) {
                                    optionClass += ` ${styles.incorrectAnswer}`;
                                }
                            }
                            return (
                                <label key={i} className={optionClass}>
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        checked={userAnswers[index] === option}
                                        onChange={() => handleAnswerChange(index, option)}
                                        disabled={submitted}
                                    />
                                    {option}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className={styles.quizActions}>
                {!submitted ? (
                    <button className={styles.submitQuizButton} onClick={handleSubmit}>
                        Submit Answers
                    </button>
                ) : (
                    <button className={styles.modeButton} onClick={() => { setTakeQuizMode(false); setSubmitted(false); setUserAnswers({}); }}>
                        View Explanations
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizDisplay;