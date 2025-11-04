import React, { useState } from 'react';
import axios from 'axios';
import QuizDisplay from './QuizDisplay';

const GenerateQuiz = ({ apiUrl, onQuizGenerated }) => {
    const [url, setUrl] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [titlePreview, setTitlePreview] = useState('');

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        if (newUrl.includes('wikipedia.org/wiki/')) {
            axios.get(`${apiUrl}/validate-url/?url=${newUrl}`).then(res => setTitlePreview(res.data.title));
        } else {
            setTitlePreview('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${apiUrl}/generate-quiz/`, { url }).then(res => {
            setQuiz(res.data);
            onQuizGenerated();
        }).finally(() => setLoading(false));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="url" value={url} onChange={handleUrlChange} placeholder="Enter Wikipedia URL" required />
                <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Quiz'}</button>
            </form>
            {titlePreview && <p>Preview: <strong>{titlePreview}</strong></p>}
            {quiz && <QuizDisplay quizData={quiz} />}
        </div>
    );
};

export default GenerateQuiz;