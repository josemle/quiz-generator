# IntelliQuiz – Wikipedia Quiz Generator

[![Frontend Live](https://img.shields.io/badge/frontend-live-green)](https://intelliquizwiki.netlify.app/)
[![Backend Docs](https://img.shields.io/badge/backend-API-blue)](https://intelliquiz-api.onrender.com/docs#/)
[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)
[![backend.md](https://img.shields.io/badge/backend.md-lightgrey)](./backend/backend.md)
[![frontend.md](https://img.shields.io/badge/frontend.md-lightgrey)](./frontend/frontend.md)
---

## About

**IntelliQuiz** is an AI-powered platform to automatically generate quizzes from Wikipedia articles. It features a modern React/TypeScript frontend and a FastAPI backend utilizing the Gemini LLM API. Persistent data is stored with PostgreSQL, hosted via Render. Users can input any Wikipedia URL to receive auto-generated quizzes with key entities, explanations, and summaries.

---

## Demo Links

- **Frontend:** [https://intelliquizwiki.netlify.app/](https://intelliquizwiki.netlify.app/)
- **Backend API (Swagger UI):** [https://intelliquiz-api.onrender.com/docs#/](https://intelliquiz-api.onrender.com/docs#/)
- **GitHub Repo:** [A-P-Shukla/quiz-generator-project](https://github.com/A-P-Shukla/quiz-generator-project)

---

## Project Structure
```
quiz-generator-project/
│
├── frontend/ # React/TS client
│ └── ... # Components, pages, styles, hooks, etc.
│
├── backend/ # FastAPI service
│ └── ... # main.py, models, schemas, crud, database
│
└── README.md # (this file)
```

---

## Frontend (React/TypeScript)

- Built with **React 18**, **TypeScript**, **Tailwind CSS**.
- Features:
  - Input Wikipedia URL, validate, and generate quiz
  - Dynamic quiz rendering, instant feedback, recap/summary
  - Key entities and AI-generated content visualization
  - Routing: Home, Quiz, Results pages
- Technologies:
  - React Router
  - Axios
  - CSS Modules/SCSS/Tailwind
  - Jest + React Testing Library

### Quick Start

1. Clone the repo:
```
git clone https://github.com/A-P-Shukla/quiz-generator-project.git
cd quiz-generator-project/frontend
```
2. Install dependencies:
```
npm install # or yarn install
```
3. Configure `.env`:
```
VITE_BACKEND_URL="http://localhost:8000"

(Replace with live backend URL.)
```
4. Start development:
```
npm run dev # or yarn dev
```

5. Build:
```
npm run build
```

---

## Backend (FastAPI)

- **FastAPI** server orchestrates:
- Wikipedia scraping (BeautifulSoup)
- Quiz generation via Gemini LLM API (LangChain)
- REST endpoints, persistent storage (PostgreSQL/SQLite)
- Modules:
- `main.py` – App entry, routes, scraping/LLM logic
- `models.py` – SQLAlchemy ORM models
- `schemas.py` – Pydantic data validation
- `database.py` – DB setup/session management
- `crud.py` – Quiz creation/query logic

### Quick Start

1. Clone the repo:
```
cd quiz-generator-project/backend
```

2. Create & activate environment:
```
python -m venv venv
source venv/bin/activate

On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Configure `.env`:
```
GEMINI_API_KEY=your_google_genai_api_key
DATABASE_URL=sqlite:///quiz.db

(Replace with PostgreSQL URL for production.)
```

5. Start server:
```
uvicorn app.main:app --reload
```

---

## API Overview

- **POST** `/generate-quiz` – Generate quiz for a Wikipedia URL
- **GET** `/quizzes` – List saved quizzes
- **GET** `/validate-url?url=` – Validate Wikipedia URL/title

Responses include quiz questions, answers, explanations, difficulty, key entities, summary, and related topics.

Detailed OpenAPI docs: [Backend API Docs](https://intelliquiz-api.onrender.com/docs#/)

---

## Contribution Guide

- Fork & clone the repo
- Feature branches for changes
- Lint code-style: ESLint, Prettier, PEP8 (Python)
- Write/expand unit tests (Jest, React Testing Library for frontend)
- Submit pull requests with descriptive commit messages

---

## Authors & Contact

- **Akhand Pratap Shukla**
- [GitHub](https://github.com/A-P-Shukla/)
- [LinkedIn](https://www.linkedin.com/in/akhand-pratap-shukla/)
- Email: akhandshukla36@gmail.com

---

## License

Released under the **MIT License** – see [LICENSE](./LICENSE).

---