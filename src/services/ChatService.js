const OpenAI = require('openai');
const KnowledgeBase = require('./KnowledgeBase');
const CareerAnalyzer = require('./CareerAnalyzer');
const ResponseFormatter = require('./ResponseFormatter');
const MockAIService = require('./MockAIService');

class ChatService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.mockAI = new MockAIService();
    this.knowledgeBase = new KnowledgeBase();
    this.careerAnalyzer = new CareerAnalyzer();
    this.responseFormatter = new ResponseFormatter();
    this.useOpenAI = process.env.USE_OPENAI !== 'false';
  }

  async processMessage(message, session) {
    try {
      // Add user message to session
      session.addMessage('user', message);
      
      // Determine if this is a career-related query
      const isCareerQuery = this.isCareerRelatedQuery(message);
      
      // Get relevant context from knowledge base if needed
      let ragContext = [];
      if (isCareerQuery) {
        ragContext = await this.knowledgeBase.search(message);
      }
      
      // Build conversation context
      const conversationHistory = session.getHistory();
      const userProfile = session.getProfile();
      
      // Generate AI response
      const aiResponse = await this.generateResponse(
        message,
        conversationHistory,
        userProfile,
        ragContext,
        isCareerQuery
      );
      
      // Add AI response to session
      session.addMessage('assistant', aiResponse.message);
      
      // Generate career recommendations if applicable
      let recommendations = [];
      if (isCareerQuery && userProfile && Object.keys(userProfile).length > 0) {
        recommendations = await this.careerAnalyzer.generateRecommendations(
          userProfile,
          message,
          ragContext
        );
      }
      
      // Format final response
      const formattedResponse = this.responseFormatter.format({
        message: aiResponse.message,
        recommendations,
        sessionId: session.id,
        contextUsed: ragContext.map(item => item.source),
        isCareerQuery
      });
      
      return formattedResponse;
      
    } catch (error) {
      console.error('ChatService error:', error);
      throw error;
    }
  }

  async generateResponse(message, history, profile, ragContext, isCareerQuery) {
    // Try OpenAI first, fallback to mock if it fails
    if (this.useOpenAI) {
      try {
        const systemPrompt = this.buildSystemPrompt(profile, ragContext, isCareerQuery);
        const conversationMessages = this.buildConversationMessages(history, message);
        
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationMessages
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        
        return {
          message: completion.choices[0].message.content
        };
      } catch (error) {
        console.log('OpenAI API failed, using mock AI service:', error.message);
        // Fallback to mock AI
        return await this.mockAI.generateResponse(message, history, profile, ragContext, isCareerQuery);
      }
    } else {
      // Use mock AI service
      return await this.mockAI.generateResponse(message, history, profile, ragContext, isCareerQuery);
    }
  }

  buildSystemPrompt(profile, ragContext, isCareerQuery) {
    let prompt = `You are SkillMentor AI Pro, a personalized career and skills advisor. You are conversational, empathetic, and provide actionable advice.

Key guidelines:
- Be conversational and supportive
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Use data from the knowledge base when available
- Keep responses clear and accessible`;

    if (profile && Object.keys(profile).length > 0) {
      prompt += `\n\nUser Profile:
${JSON.stringify(profile, null, 2)}`;
    }

    if (ragContext.length > 0) {
      prompt += `\n\nRelevant Knowledge Base Information:
${ragContext.map(item => `- ${item.content} (Source: ${item.source})`).join('\n')}`;
    }

    if (isCareerQuery) {
      prompt += `\n\nThis appears to be a career-related query. Focus on providing career guidance, skill development advice, and learning recommendations.`;
    }

    return prompt;
  }

  buildConversationMessages(history, currentMessage) {
    const messages = [];
    
    // Add recent conversation history
    const recentHistory = history.slice(-10); // Last 10 messages
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    // Add current message
    messages.push({
      role: 'user',
      content: currentMessage
    });
    
    return messages;
  }

  isCareerRelatedQuery(message) {
    const careerKeywords = [
      'career', 'job', 'skill', 'learning', 'course', 'certification',
      'resume', 'interview', 'salary', 'promotion', 'development',
      'training', 'education', 'roadmap', 'path', 'transition',
      'industry', 'role', 'position', 'experience', 'qualification',
      'data scientist', 'software engineer', 'developer', 'programmer',
      'product manager', 'designer', 'analyst', 'engineer', 'manager',
      'become', 'want to be', 'how to', 'learn', 'study', 'get into'
    ];
    
    const lowerMessage = message.toLowerCase();
    return careerKeywords.some(keyword => lowerMessage.includes(keyword));
  }
}

module.exports = ChatService;