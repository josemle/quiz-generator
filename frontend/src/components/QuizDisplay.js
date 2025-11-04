import React, { useState } from 'react';

const QuizDisplay = ({ quizData }) => {
    const [takeQuizMode, setTakeQuizMode] = useState(false);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => setSubmitted(true);

    let score = 0;
    if (submitted) {
        quizData.quiz_data.forEach((q, i) => {
            if (answers[i] === q.answer) score++;
        });
    }

    if (takeQuizMode) {
        return (
            <div>
                {!submitted ? (
                    quizData.quiz_data.map((q, i) => (
                        <div key={i}>
                            <p>{q.question}</p>
                            {q.options.map(opt => <div key={opt}><input type="radio" name={`q${i}`} onChange={() => setAnswers({...answers, [i]: opt})} />{opt}</div>)}
                        </div>
                    ))
                ) : (
                    <p>Your Score: {score}/{quizData.quiz_data.length}</p>
                )}
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={() => setTakeQuizMode(false)}>View Answers</button>
            </div>
        );
    }

    return (
        <div>
            <h2>{quizData.title}</h2>
            <button onClick={() => setTakeQuizMode(true)}>Take Quiz</button>
            {quizData.quiz_data.map((q, i) => (
                <div key={i}>
                    <p><strong>Question:</strong> {q.question}</p>
                    <p><strong>Answer:</strong> {q.answer}</p>
                </div>
            ))}
        </div>
    );
};

export default QuizDisplay;