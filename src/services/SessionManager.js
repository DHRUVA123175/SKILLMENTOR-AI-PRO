const NodeCache = require('node-cache');

class Session {
  constructor(id) {
    this.id = id;
    this.messages = [];
    this.profile = {};
    this.createdAt = new Date();
    this.lastActivity = new Date();
    this.maxMessages = parseInt(process.env.CONVERSATION_MEMORY_LIMIT) || 10;
  }

  addMessage(role, content) {
    this.messages.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the last N messages
    if (this.messages.length > this.maxMessages * 2) {
      this.messages = this.messages.slice(-this.maxMessages * 2);
    }
    
    this.lastActivity = new Date();
  }

  getHistory() {
    return this.messages;
  }

  updateProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
    this.lastActivity = new Date();
  }

  getProfile() {
    return this.profile;
  }

  isExpired(ttlHours = 24) {
    const now = new Date();
    const diffHours = (now - this.lastActivity) / (1000 * 60 * 60);
    return diffHours > ttlHours;
  }
}

class SessionManager {
  constructor() {
    // Cache sessions for 24 hours
    this.cache = new NodeCache({ 
      stdTTL: 24 * 60 * 60,
      checkperiod: 60 * 60 // Check for expired sessions every hour
    });
    
    // Clean up expired sessions periodically
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000); // Every hour
  }

  createSession(sessionId) {
    const session = new Session(sessionId);
    this.cache.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    const session = this.cache.get(sessionId);
    if (session && !session.isExpired()) {
      return session;
    }
    
    // Remove expired session
    if (session) {
      this.cache.del(sessionId);
    }
    
    return null;
  }

  deleteSession(sessionId) {
    this.cache.del(sessionId);
  }

  cleanupExpiredSessions() {
    const keys = this.cache.keys();
    keys.forEach(key => {
      const session = this.cache.get(key);
      if (session && session.isExpired()) {
        this.cache.del(key);
      }
    });
  }

  getActiveSessionsCount() {
    return this.cache.keys().length;
  }

  getSessionStats() {
    const keys = this.cache.keys();
    const sessions = keys.map(key => this.cache.get(key)).filter(Boolean);
    
    return {
      total: sessions.length,
      averageMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0) / sessions.length || 0,
      oldestSession: sessions.reduce((oldest, s) => 
        !oldest || s.createdAt < oldest.createdAt ? s : oldest, null
      )?.createdAt
    };
  }
}

module.exports = SessionManager;