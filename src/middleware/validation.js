const validateChatRequest = (req, res, next) => {
  const { session_id, message } = req.body;
  
  // Validate required fields
  if (!session_id) {
    return res.status(400).json({
      error: 'session_id is required',
      message: 'Please provide a valid session ID to continue our conversation.'
    });
  }
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'message is required',
      message: 'Please provide a message to continue our conversation.'
    });
  }
  
  // Validate message length
  if (message.length > 5000) {
    return res.status(400).json({
      error: 'message too long',
      message: 'Please keep your message under 5000 characters.'
    });
  }
  
  // Validate session_id format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(session_id)) {
    return res.status(400).json({
      error: 'invalid session_id format',
      message: 'Please provide a valid session ID.'
    });
  }
  
  // Validate user_profile if provided
  if (req.body.user_profile) {
    const profileValidation = validateUserProfile(req.body.user_profile);
    if (!profileValidation.valid) {
      return res.status(400).json({
        error: 'invalid user_profile',
        message: profileValidation.message
      });
    }
  }
  
  // Sanitize message
  req.body.message = message.trim();
  
  next();
};

const validateUserProfile = (profile) => {
  if (typeof profile !== 'object' || profile === null) {
    return { valid: false, message: 'User profile must be an object' };
  }
  
  // Validate skills array if provided
  if (profile.skills && !Array.isArray(profile.skills)) {
    return { valid: false, message: 'Skills must be an array' };
  }
  
  // Validate experience array if provided
  if (profile.experience && !Array.isArray(profile.experience)) {
    return { valid: false, message: 'Experience must be an array' };
  }
  
  // Validate education array if provided
  if (profile.education && !Array.isArray(profile.education)) {
    return { valid: false, message: 'Education must be an array' };
  }
  
  // Validate experience level if provided
  if (profile.experience_level && typeof profile.experience_level !== 'string') {
    return { valid: false, message: 'Experience level must be a string' };
  }
  
  // Validate preferred industries if provided
  if (profile.preferred_industries && !Array.isArray(profile.preferred_industries)) {
    return { valid: false, message: 'Preferred industries must be an array' };
  }
  
  return { valid: true };
};

const validateSessionId = (req, res, next) => {
  const { sessionId } = req.params;
  
  if (!sessionId) {
    return res.status(400).json({
      error: 'session_id is required'
    });
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return res.status(400).json({
      error: 'invalid session_id format'
    });
  }
  
  next();
};

module.exports = {
  validateChatRequest,
  validateUserProfile,
  validateSessionId
};