import React, { useState } from 'react';
import './App.css';
import styles from './App.module.css';
import GenerateQuiz from './components/GenerateQuiz';
import PastQuizzes from './components/PastQuizzes';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  
  // A key is used to force remount of PastQuizzes component when a quiz is generated
  const [historyKey, setHistoryKey] = useState(1); 

  return (
    <div className={styles.appWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
            {/* Simple SVG Logo */}
            <svg className={styles.logo} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm4-4h-2v-4h-2V7h4v6z" fill="currentColor"/>
            </svg>
            <h1 className={styles.appName}>IntelliQuiz</h1>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'generate' ? styles.active : ''}`} 
            onClick={() => setActiveTab('generate')}>
            Create New Quiz
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`} 
            onClick={() => setActiveTab('history')}>
            Quiz History
          </button>
        </div>

        <div className={styles.contentArea}>
          {activeTab === 'generate' ? (
            <GenerateQuiz apiUrl={API_URL} onQuizGenerated={() => {
              setHistoryKey(prevKey => prevKey + 1); // Update key to trigger refresh
              setActiveTab('history');
            }} />
          ) : (
            <PastQuizzes key={historyKey} apiUrl={API_URL} />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} IntelliQuiz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;