const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ChatService = require('../services/ChatService');
const SessionManager = require('../services/SessionManager');
const { validateChatRequest } = require('../middleware/validation');

const router = express.Router();
const chatService = new ChatService();
const sessionManager = new SessionManager();

// Start new chat session
router.post('/session', (req, res) => {
  try {
    const sessionId = uuidv4();
    sessionManager.createSession(sessionId);
    
    res.json({
      session_id: sessionId,
      message: "Hello! I'm SkillMentor AI Pro, your personalized career and skills advisor. How can I help you today?",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Main chat endpoint
router.post('/message', validateChatRequest, async (req, res) => {
  try {
    const { session_id, message, user_profile } = req.body;
    
    // Get or create session
    let session = sessionManager.getSession(session_id);
    if (!session) {
      session = sessionManager.createSession(session_id);
    }
    
    // Update user profile if provided
    if (user_profile) {
      session.updateProfile(user_profile);
    }
    
    // Process the message
    const response = await chatService.processMessage(message, session);
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      message: "I'm sorry, I encountered an error. Please try again.",
      meta: {
        session_id: req.body.session_id,
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    });
  }
});

// Get session history
router.get('/session/:sessionId/history', (req, res) => {
  try {
    const session = sessionManager.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      session_id: req.params.sessionId,
      history: session.getHistory(),
      profile: session.getProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve session history' });
  }
});

module.exports = router;