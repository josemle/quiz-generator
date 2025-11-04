import React, { useState } from 'react';
import axios from 'axios';
import styles from './GenerateQuiz.module.css';
import QuizDisplay from './QuizDisplay';

const GenerateQuiz = ({ apiUrl, onQuizGenerated }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [titlePreview, setTitlePreview] = useState('');
    const [generatedQuiz, setGeneratedQuiz] = useState(null);

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setError('');
        setGeneratedQuiz(null);
        
        if (newUrl && newUrl.includes('wikipedia.org/wiki/')) {
            axios.get(`${apiUrl}/validate-url/?url=${encodeURIComponent(newUrl)}`)
                .then(res => setTitlePreview(res.data.title))
                .catch(() => setTitlePreview(''));
        } else {
            setTitlePreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) {
            setError('Please enter a valid Wikipedia URL to begin.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedQuiz(null);

        try {
            const response = await axios.post(`${apiUrl}/generate-quiz/`, { url });
            setGeneratedQuiz(response.data);
            onQuizGenerated();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate quiz. Please check the URL and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1>Create a Quiz Instantly</h1>
                <p>Turn any Wikipedia article into a multiple-choice quiz. Just paste the URL below to get started.</p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        type="url"
                        value={url}
                        onChange={handleUrlChange}
                        className={styles.urlInput}
                        placeholder="Paste a Wikipedia article link here..."
                        disabled={isLoading}
                    />
                     {titlePreview && !isLoading && <span className={styles.preview}>✓ {titlePreview}</span>}
                </div>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Create Quiz'}
                </button>
            </form>
            
            {isLoading && (
              <div className={styles.loaderContainer}>
                <div className="spinner"></div>
                <p>Scraping the article and generating questions...</p>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}

            {generatedQuiz && (
                <div className={styles.results}>
                    <h2 className={styles.resultsTitle}>Quiz Ready!</h2>
                    
                    {/* --- KEY CHANGE --- */}
                    {/* We pass the `startInQuizMode` prop here to force the initial state */}
                    <QuizDisplay quizData={generatedQuiz} startInQuizMode={true} />

                </div>
            )}
        </div>
    );
};

export default GenerateQuiz;