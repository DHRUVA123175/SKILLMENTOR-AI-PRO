const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  let statusCode = 500;
  let message = 'I apologize, but I encountered an unexpected error. Please try again.';
  let errorType = 'internal_server_error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Please check your input and try again.';
    errorType = 'validation_error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Authentication required.';
    errorType = 'unauthorized';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'I\'m having trouble connecting to my services. Please try again in a moment.';
    errorType = 'service_unavailable';
  } else if (err.message && err.message.includes('OpenAI')) {
    statusCode = 503;
    message = 'I\'m experiencing issues with my AI services. Please try again shortly.';
    errorType = 'ai_service_error';
  } else if (err.message && err.message.includes('rate limit')) {
    statusCode = 429;
    message = 'You\'re sending messages too quickly. Please wait a moment before trying again.';
    errorType = 'rate_limit_exceeded';
  }
  
  // Create error response in the expected format
  const errorResponse = {
    message: message,
    recommendations: [],
    html_snippet: generateErrorHtml(message, errorType),
    meta: {
      session_id: req.body?.session_id || req.params?.sessionId || null,
      timestamp: new Date().toISOString(),
      context_used: [],
      error_type: errorType
    }
  };
  
  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.meta.error_details = {
      message: err.message,
      stack: err.stack,
      name: err.name
    };
  }
  
  res.status(statusCode).json(errorResponse);
};

const generateErrorHtml = (message, errorType) => {
  const iconMap = {
    'validation_error': '⚠️',
    'unauthorized': '🔒',
    'service_unavailable': '🔧',
    'ai_service_error': '🤖',
    'rate_limit_exceeded': '⏱️',
    'internal_server_error': '❌'
  };
  
  const colorMap = {
    'validation_error': 'yellow',
    'unauthorized': 'red',
    'service_unavailable': 'orange',
    'ai_service_error': 'blue',
    'rate_limit_exceeded': 'purple',
    'internal_server_error': 'red'
  };
  
  const icon = iconMap[errorType] || '❌';
  const color = colorMap[errorType] || 'red';
  
  return `<section class="bg-${color}-50 border border-${color}-200 rounded-lg p-4">
  <div class="flex items-center space-x-3">
    <div class="flex-shrink-0">
      <span class="text-2xl">${icon}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-sm font-medium text-${color}-800">
        Oops! Something went wrong
      </h3>
      <p class="mt-1 text-sm text-${color}-700">
        ${message}
      </p>
      <div class="mt-3">
        <button onclick="window.location.reload()" 
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-${color}-700 bg-${color}-100 hover:bg-${color}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500">
          Try Again
        </button>
      </div>
    </div>
  </div>
</section>`;
};

const notFoundHandler = (req, res) => {
  const errorResponse = {
    message: "I'm sorry, I don't understand that request. Please try asking me about careers, skills, or learning recommendations.",
    recommendations: [],
    html_snippet: `<section class="bg-gray-50 border border-gray-200 rounded-lg p-4">
  <div class="text-center">
    <span class="text-4xl mb-2 block">🤔</span>
    <h3 class="text-sm font-medium text-gray-800 mb-1">Page Not Found</h3>
    <p class="text-sm text-gray-600">The page you're looking for doesn't exist.</p>
  </div>
</section>`,
    meta: {
      session_id: null,
      timestamp: new Date().toISOString(),
      context_used: [],
      error_type: 'not_found'
    }
  };
  
  res.status(404).json(errorResponse);
};

module.exports = {
  errorHandler,
  notFoundHandler
};