# AI Webapp - MERN Stack with React Flow

A simple AI-powered web application that allows users to input prompts and receive AI responses visualized through React Flow nodes.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + React Flow + Material UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **AI**: OpenRouter API (Google Gemini Flash 1.5)
- **Deployment**: Docker & Docker Compose

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- OpenRouter API key

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-webapp
```

2. Create `.env` file in root directory:
```bash
cp .env.example .env
```

3. Update `.env` with your OpenRouter API key:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Start all services:
```bash
docker-compose up -d
```

5. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

## Manual Setup (Development)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```
PORT=3001
MONGODB_URI=mongodb+srv://abcd:abcd@cluster0.rxzs8wf.mongodb.net/?appName=Cluster0
OPENROUTER_API_KEY=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

```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
 
## API Endpoints

- `POST /api/ask-ai` - Send prompt to AI
- `POST /api/save` - Save conversation
- `GET /api/history` - Get chat history
- `GET /ping` - Health check

## Docker Services

- **Frontend**: Nginx serving React app on port 80
- **Backend**: Node.js API server on port 3001
- **MongoDB**: Hosted Database on mongo db

## Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key (required)
- `PORT`: Backend server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string