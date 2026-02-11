# AI-Powered Placement Preparation Portal

A highly scalable, modern, and unique web platform that helps college students prepare for placements using AI-driven analytics, adaptive learning paths, coding practice, mock interviews, and real interview experiences.

## 🚀 Features

- **AI Roadmap Generation**: Personalized week-by-week study plans based on your target companies and skill level.
- **AI Resume Analyzer**: ATS compatibility check and improvement suggestions.
- **AI Mock Interviews**: Real-time voice/text interviews with AI feedback.
- **Senior Experience Hub**: Real interview questions and tips from seniors, processed by AI.
- **Coding Practice**: Topic-wise coding problems with execution sandbox.
- **Placement Analytics**: Heatmaps and readiness scores to track progress.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Zustand, React Query.
- **Backend**: Node.js, Express.js, MongoDB, Socket.io.
- **AI**: OpenAI API (GPT-4 Turbo).
- **DevOps**: Docker, Docker Compose.

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- OpenAI API Key

### Local Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Placement-Website
   ```

2. **Backend Setup**
   ```bash
   cd server
   cp .env.example .env
   # Update .env with your MONGO_URI and OPENAI_API_KEY
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Using Docker
```bash
cd docker
docker-compose up --build
```

## 📄 API Documentation
API documentation is available at `http://localhost:5000/api-docs` (when Swagger is enabled).

## 🛡 License
MIT
