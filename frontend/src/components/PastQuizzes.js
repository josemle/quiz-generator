import React, { useState } from 'react';
import QuizDisplay from './QuizDisplay';

const PastQuizzes = ({ quizzes }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    return (
        <div>
            <table>
                <tbody>
                    {quizzes.map(quiz => (
                        <tr key={quiz.id}>
                            <td>{quiz.title}</td>
                            <td><button onClick={() => setSelectedQuiz(quiz)}>Details</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedQuiz && <div className="modal"><QuizDisplay quizData={selectedQuiz} /><button onClick={() => setSelectedQuiz(null)}>Close</button></div>}
        </div>
    );
};

export default PastQuizzes;