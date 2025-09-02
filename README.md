# SkillMentor AI Pro

A complete, production-grade AI-powered career and skills advisor application. Built for hackathons and ready for live deployment with both backend API and modern React frontend.

## 🎯 **Complete Full-Stack Solution**

This project includes:
- **Backend API**: Production-ready Node.js/Express server with AI integration
- **Frontend App**: Modern React application with real-time chat interface
- **AI Integration**: OpenAI GPT-4 powered career recommendations
- **Knowledge Base**: RAG system with career and skills data

## 🚀 Features

- **Real-time Chat**: Multi-turn conversation memory with session management
- **Career Analysis**: AI-powered career recommendations and skills gap analysis
- **Knowledge Base (RAG)**: Context-aware responses using embedded knowledge
- **Personalized Roadmaps**: 30/60/90-day learning plans
- **Production Ready**: Rate limiting, error handling, security middleware
- **Frontend Integration**: JSON + HTML responses for seamless UI integration

## 🏗️ Architecture

```
src/
├── server.js              # Express server setup
├── routes/
│   └── chat.js            # Chat API endpoints
├── services/
│   ├── ChatService.js     # Main chat processing logic
│   ├── SessionManager.js  # Session and memory management
│   ├── KnowledgeBase.js   # RAG knowledge retrieval
│   ├── CareerAnalyzer.js  # Career recommendations engine
│   └── ResponseFormatter.js # JSON + HTML response formatting
└── middleware/
    ├── validation.js      # Request validation
    └── errorHandler.js    # Error handling and formatting
```

## 🚀 **Quick Start**

### Backend Setup
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

3. **Start Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup
1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend**
   ```bash
   npm start
   ```

### Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📡 API Endpoints

### Start New Session
```http
POST /api/chat/session
```

**Response:**
```json
{
  "session_id": "uuid-here",
  "message": "Hello! I'm SkillMentor AI Pro...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Send Message
```http
POST /api/chat/message
Content-Type: application/json

{
  "session_id": "uuid-here",
  "message": "I want to become a software engineer",
  "user_profile": {
    "skills": ["JavaScript", "HTML", "CSS"],
    "experience_level": "beginner",
    "preferred_industries": ["technology", "startups"]
  }
}
```

**Response:**
```json
{
  "message": "Great choice! Based on your JavaScript background...",
  "recommendations": [
    {
      "career_name": "Frontend Developer",
      "reasoning": "Your JavaScript skills are a perfect foundation...",
      "market_demand": "Very High",
      "estimated_salary_range": "$70,000 - $120,000",
      "required_skills": {
        "must_have": ["JavaScript", "React", "HTML/CSS"],
        "good_to_have": ["TypeScript", "Node.js", "Testing"]
      },
      "learning_resources": [
        {
          "platform": "React.dev",
          "course_name": "React Official Tutorial",
          "link": "https://react.dev/learn",
          "duration": "2-3 weeks"
        }
      ],
      "roadmap": {
        "30_days": ["Master React fundamentals", "Build first React project"],
        "60_days": ["Learn state management", "Add TypeScript"],
        "90_days": ["Build portfolio", "Apply for positions"]
      }
    }
  ],
  "html_snippet": "<section class=\"bg-white rounded-lg...\">...</section>",
  "meta": {
    "session_id": "uuid-here",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "context_used": ["React Developer Guide", "Frontend Career Path"]
  }
}
```

### Get Session History
```http
GET /api/chat/session/{sessionId}/history
```

## 🎯 User Profile Schema

```json
{
  "skills": ["JavaScript", "Python", "SQL"],
  "experience_level": "intermediate",
  "education": [
    {
      "degree": "Bachelor's",
      "field": "Computer Science",
      "year": 2020
    }
  ],
  "experience": [
    {
      "title": "Junior Developer",
      "company": "Tech Corp",
      "duration": "2 years",
      "description": "Built web applications using React and Node.js"
    }
  ],
  "preferred_industries": ["technology", "finance"],
  "location": "San Francisco, CA",
  "salary_expectations": "$80,000 - $100,000"
}
```

## 🧠 AI Capabilities

### Conversation Memory
- Maintains last 10 user/assistant message pairs per session
- Context-aware responses using conversation history
- Session persistence with automatic cleanup

### Career Analysis
- Skills gap analysis (must-have vs good-to-have)
- Market demand assessment
- Salary range estimates
- Industry-specific recommendations

### Knowledge Base (RAG)
- Pre-loaded with career and skills data
- Contextual information retrieval
- Source attribution for transparency

### Learning Roadmaps
- Personalized 30/60/90-day plans
- Prioritized skill development
- Resource recommendations with real links

## 🎨 Frontend Integration

The API returns both JSON data and HTML snippets for flexible frontend integration:

- **message**: Plain text for immediate chat display
- **recommendations**: Structured data for custom UI components
- **html_snippet**: Pre-styled HTML using Tailwind CSS classes
- **meta**: Session info, timestamps, and context sources

## 🔒 Security & Production Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Error Handling**: User-friendly error messages
- **CORS Protection**: Configurable origin restrictions
- **Security Headers**: Helmet.js integration
- **Compression**: Gzip compression for responses

## 🚀 Deployment

### Environment Variables
```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
CONVERSATION_MEMORY_LIMIT=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring

Health check endpoint:
```http
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for hackathons and production deployments. Ready to power your next career advisor application!