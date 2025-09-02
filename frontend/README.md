# SkillMentor AI Pro - Frontend

A modern React frontend for the SkillMentor AI Pro career advisor chatbot.

## 🚀 Features

- **Real-time Chat Interface**: Smooth, responsive chat experience
- **Profile Management**: Comprehensive user profile setup and editing
- **Career Recommendations**: Interactive career path recommendations
- **Learning Resources**: Direct links to courses and learning materials
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Typing Indicators**: Enhanced user experience
- **Error Handling**: Graceful error handling and user feedback

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful, customizable icons
- **React Markdown**: Markdown rendering for rich text
- **UUID**: Unique identifier generation

## 📦 Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default backend URL is http://localhost:3000/api)
   ```

4. **Start development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3001` (or next available port).

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ChatInterface.js      # Main chat interface
│   ├── MessageBubble.js      # Individual message component
│   ├── TypingIndicator.js    # Typing animation
│   ├── RecommendationsPanel.js # Career recommendations sidebar
│   ├── ProfileSetup.js       # User profile form
│   └── Header.js             # App header with navigation
├── context/
│   └── ChatContext.js        # Chat state management
├── services/
│   └── api.js                # API client and endpoints
├── App.js                    # Main app component
├── App.css                   # Custom styles
└── index.js                  # App entry point
```

## 🎨 Key Components

### ChatInterface
- Real-time messaging with the AI backend
- Message history and session management
- Typing indicators and loading states
- Suggested questions for new users

### ProfileSetup
- Comprehensive user profile creation
- Skills and industry selection
- Experience level and preferences
- Local storage persistence

### RecommendationsPanel
- Interactive career recommendation cards
- Expandable details with skills, resources, and roadmaps
- Direct links to learning platforms
- Market demand and salary information

### MessageBubble
- Rich text rendering with Markdown support
- Context source attribution
- Timestamp display
- Error state handling

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=SkillMentor AI Pro
REACT_APP_VERSION=1.0.0
```

### API Integration
The frontend communicates with the backend through:
- `POST /api/chat/session` - Create new chat session
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/session/:id/history` - Retrieve chat history

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for tablets and desktops

## 🎯 User Experience Features

### Profile Management
- Quick profile setup wizard
- Skill and industry autocomplete
- Profile persistence in localStorage
- Easy profile editing

### Chat Experience
- Smooth message animations
- Real-time typing indicators
- Error recovery and retry
- Message timestamps
- Context source attribution

### Career Recommendations
- Interactive recommendation cards
- Expandable details
- Direct links to learning resources
- Visual skill gap analysis
- 30/60/90-day roadmaps

## 🚀 Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🧪 Testing

```bash
npm test
```

Runs the test suite in interactive watch mode.

## 📊 Performance

The app includes several performance optimizations:
- Component memoization where appropriate
- Efficient state management with React Context
- Optimized re-renders
- Lazy loading for large components
- Image optimization

## 🔒 Security

- Input sanitization
- XSS protection through React's built-in escaping
- Secure API communication
- No sensitive data stored in localStorage

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Custom components in `App.css`
- Theme variables

### Branding
Update branding elements in:
- `public/index.html` - Page title and meta
- `src/components/Header.js` - Logo and app name
- Environment variables for app name

## 🚀 Deployment

### Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for an amazing user experience!