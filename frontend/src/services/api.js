import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  
  sendMessage: (sessionId, message, userProfile = null) => 
    api.post('/chat/message', {
      session_id: sessionId,
      message,
      user_profile: userProfile
    }),
  
  getSessionHistory: (sessionId) => 
    api.get(`/chat/session/${sessionId}/history`),
};

export const healthAPI = {
  check: () => api.get('/health')
};

export default api;