import React from 'react';
import { User, Bot, Clock, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600' 
            : isError 
              ? 'bg-red-100' 
              : 'bg-gray-100'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className={`w-4 h-4 ${isError ? 'text-red-600' : 'text-gray-600'}`} />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-lg ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : isError 
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-gray-100 text-gray-900'
          }`}>
            {/* Message Text */}
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-1 ${
                        isUser ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                      } underline`}
                    >
                      <span>{children}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className={`px-1 py-0.5 rounded text-xs font-mono ${
                      isUser ? 'bg-blue-700 text-blue-100' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {children}
                    </code>
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Context Sources */}
            {message.contextUsed && message.contextUsed.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-300">
                <p className="text-xs opacity-75 mb-1">Sources:</p>
                <div className="flex flex-wrap gap-1">
                  {message.contextUsed.map((source, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* HTML Snippet */}
          {message.htmlSnippet && (
            <div 
              className="mt-3 w-full"
              dangerouslySetInnerHTML={{ __html: message.htmlSnippet }}
            />
          )}

          {/* Timestamp */}
          <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
            isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;