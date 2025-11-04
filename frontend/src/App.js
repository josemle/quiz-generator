import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import GenerateQuiz from './components/GenerateQuiz';
import PastQuizzes from './components/PastQuizzes';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = () => {
    axios.get(`${API_URL}/quizzes/`).then(res => setQuizzes(res.data));
  };

  useEffect(() => {
    if (activeTab === 'history') fetchQuizzes();
  }, [activeTab]);

  return (
    <div className="App">
      <div className="tabs">
        <button className={`tab ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}>Generate Quiz</button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Past Quizzes</button>
      </div>
      {activeTab === 'generate' ? <GenerateQuiz apiUrl={API_URL} onQuizGenerated={fetchQuizzes} /> : <PastQuizzes quizzes={quizzes} />}
    </div>
  );
}

export default App;