import React, { useState } from 'react';
import styles from './PastQuizzes.module.css';
import QuizDisplay from './QuizDisplay';

const PastQuizzes = ({ quizzes, isLoading }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    if (isLoading) {
        return <div className="spinner" style={{ margin: '50px auto' }}></div>;
    }

    if (quizzes.length === 0) {
        return <p className={styles.noQuizzes}>No quizzes generated yet. Go to the "Generate Quiz" tab to create one!</p>;
    }

    return (
        <div className={styles.container}>
            <table className={styles.quizTable}>
                <thead>
                    <tr>
                        <th>Article Title</th>
                        <th>URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map(quiz => (
                        <tr key={quiz.id}>
                            <td>{quiz.title}</td>
                            <td><a href={quiz.url} target="_blank" rel="noopener noreferrer">{quiz.url}</a></td>
                            <td>
                                <button className={styles.detailsButton} onClick={() => setSelectedQuiz(quiz)}>
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedQuiz && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedQuiz(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedQuiz(null)}>×</button>
                        <QuizDisplay quizData={selectedQuiz} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PastQuizzes;