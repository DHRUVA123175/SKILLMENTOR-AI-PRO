import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

const initialState = {
  sessionId: null,
  messages: [],
  isLoading: false,
  error: null,
  recommendations: [],
  isTyping: false
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isTyping: false
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isTyping: false };
    
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'RESET_CHAT':
      return { ...initialState };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    // Initialize session on mount
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const response = await chatAPI.createSession();
      dispatch({ type: 'SET_SESSION_ID', payload: response.session_id });
      
      // Add welcome message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: uuidv4(),
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp,
          htmlSnippet: null
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize chat session' });
    }
  };

  const sendMessage = async (message, userProfile = null) => {
    if (!state.sessionId || !message.trim()) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_TYPING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await chatAPI.sendMessage(state.sessionId, message, userProfile);
      
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message,
        timestamp: response.meta.timestamp,
        htmlSnippet: response.html_snippet,
        contextUsed: response.meta.context_used
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: response.recommendations || [] });
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: error.response?.data?.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'RESET_CHAT' });
    initializeSession();
  };

  const value = {
    ...state,
    sendMessage,
    clearChat,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};