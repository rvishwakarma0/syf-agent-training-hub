import axios from 'axios';

const API_BASE_URL = 'http://3.82.22.210:8080/api'; // External Spring Boot server URL

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Spring Boot API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Spring Boot API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Spring Boot API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// API Service Functions for Spring Boot Integration
export const apiService = {
  // Health Check
  async healthCheck() {
    try {
      // Simple endpoint check - you can add a health endpoint to your Spring Boot app
      const response = await apiClient.get('/chat/health');
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: 'Spring Boot API is accessible'
      };
    } catch (error) {
      console.warn('❌ Health Check failed:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: {
          status: 'healthy',
          message: 'Spring Boot API connection failed - using fallback responses',
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  // Start Training Pod Session
  async startScenario(scenarioData) {
    try {
      console.log('🚀 Starting Spring Boot pod session with:', scenarioData);

      // Map frontend scenario to tpodId
      const tpodMapping = {
        'customer-service': 'customer-support-tpod',
        'sales-conversation': 'sales-training-tpod',
        'difficult-customer': 'difficult-customer-tpod',
        'loan-consultation': 'loan-consultation-tpod',
      };

      const payload = {
        tpodId: tpodMapping[scenarioData.scenario] || 'customer-support-tpod',
        userId: 'current-user' // You can get this from user context
      };

      const response = await apiClient.post('/chat/start-pod', payload);

      return {
        success: true,
        data: {
          sessionId: response.data.sessionId,
          scenario: scenarioData.scenario,
          tpodId: payload.tpodId,
          initialMessage: response.data.message,
          customerEmotion: 'neutral',
          timestamp: response.data.timestamp,
        },
      };
    } catch (error) {
      console.warn('Start Scenario API failed, using fallback:', error.message);

      // Fallback response
      return {
        success: true,
        data: {
          sessionId: `session-${Date.now()}`,
          scenario: scenarioData.scenario,
          tpodId: 'customer-support-tpod',
          initialMessage: this.getScenarioMessage(scenarioData.scenario),
          customerEmotion: 'frustrated',
          timestamp: new Date().toISOString(),
        },
        fallback: true,
      };
    }
  },

  // Send Message to Spring Boot API
  async sendMessage(messageData) {
    try {
      console.log('💬 Sending message to Spring Boot API:', messageData);

      const payload = {
        sessionId: messageData.sessionId,
        tpodId: messageData.tpodId || 'customer-support-tpod',
        message: messageData.message
      };

      const response = await apiClient.post('/chat/message', payload);

      // Parse evaluation message for empathy score
      const empathyScore = this.extractEmpathyScore(response.data.evalMsg);

      return {
        success: true,
        data: {
          sessionId: response.data.sessionId,
          empathyScore: empathyScore,
          responseTime: 2.0,
          aiResponse: response.data.message,
          feedback: response.data.evalMsg,
          timestamp: response.data.timestamp,
        },
      };
    } catch (error) {
      console.warn('Send Message API failed, using fallback:', error.message);

      // Fallback response with simulated empathy scoring
      const empathyScore = this.calculateEmpathyScore(messageData.message);
      return {
        success: true,
        data: {
          sessionId: messageData.sessionId,
          empathyScore: empathyScore,
          responseTime: Math.random() * 3 + 1,
          aiResponse: this.generateAIResponse(messageData.message, empathyScore),
          feedback: this.generateFeedback(empathyScore),
          timestamp: new Date().toISOString(),
        },
        fallback: true,
      };
    }
  },

  // Get Feedback from API
  async getFeedback(feedbackData) {
    try {
      const payload = {
        messages: feedbackData.messages || feedbackData.chats,
        tpodId: feedbackData.tpodId,
        userId: feedbackData.userId || 'RAJ02',
        sessionId: feedbackData.sessionId
      };

      console.log('📊 Requesting feedback:', payload);

      const response = await apiClient.post('/chat/get-feedback', payload);

      return {
        success: true,
        data: {
          feedback: typeof response.data === 'string'
            ? response.data
            : response.data.message || response.data.feedback,
          type: feedbackData.feedbackType || 'help'
        }
      };
    } catch (error) {
      console.error('❌ Get feedback failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: true,
      };
    }
  },

  // Get Session Analysis
  async getAnalysis(sessionId) {
    try {
      console.log('📊 Getting session analysis for:', sessionId);

      const response = await apiClient.get(`/chat/analysis/${sessionId}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.warn('Get Analysis API failed, using fallback:', error.message);

      // Fallback response
      return {
        success: true,
        data: {
          sessionId: sessionId,
          overallScore: Math.floor(Math.random() * 20) + 80,
          totalMessages: Math.floor(Math.random() * 10) + 5,
          summary: 'Training session completed successfully. Good empathy and communication skills demonstrated.',
          suggestions: [
            'Continue using empathetic language',
            'Ask more open-ended questions',
            'Acknowledge customer emotions more frequently'
          ],
        },
        fallback: true,
      };
    }
  },

  // Quit Session
  async quitSession(sessionData) {
    try {
      console.log('🚪 Quitting session:', sessionData);

      const payload = {
        sessionId: sessionData.sessionId,
        tpodId: sessionData.tpodId,
        reason: sessionData.reason || 'user_quit',
        duration: sessionData.duration,
        messagesExchanged: sessionData.messagesExchanged
      };

      await apiClient.post('/chat/quit-session', payload);

      return {
        success: true,
        message: 'Session quit successfully'
      };
    } catch (error) {
      console.warn('Quit session API failed:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  },

  // Complete Session
  async completeSession(sessionData) {
    try {
      console.log('✅ Completing session:', sessionData);

      const payload = {
        sessionId: sessionData.sessionId,
        tpodId: sessionData.tpodId,
        totalMessages: sessionData.totalMessages,
        duration: sessionData.duration,
        completedAt: new Date().toISOString()
      };

      await apiClient.post('/chat/complete-session', payload);

      return {
        success: true,
        message: 'Session completed successfully'
      };
    } catch (error) {
      console.warn('Complete session API failed:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  },

  // Helper function to extract empathy score from evaluation message
  extractEmpathyScore(evalMsg) {
    if (!evalMsg) return 75;

    // Simple regex to extract score (you can improve this based on your evaluator format)
    const scoreMatch = evalMsg.match(/score[:\s]*(\d+)/i);
    if (scoreMatch) {
      return parseInt(scoreMatch[1]);
    }

    // Fallback: analyze keywords for empathy
    return this.calculateEmpathyScore(evalMsg);
  },

  // Helper Functions
  getScenarioMessage(scenario) {
    const scenarios = {
      'customer-service': "I'm really frustrated with your service! I've been trying to resolve this issue for weeks and nobody seems to care. Can you actually help me?",
      'sales-conversation': "I'm interested in your loan products, but I've had bad experiences with banks before. Why should I trust you?",
      'difficult-customer': "This is absolutely ridiculous! I've been charged fees that I never agreed to. I want these charges removed NOW!",
      'loan-consultation': "I need a loan but my credit isn't perfect. I'm worried you'll just reject me like the other banks did.",
    };
    return scenarios[scenario] || "I have a concern that I'd like to discuss with you. Can you help me?";
  },

  calculateEmpathyScore(message) {
    const empathyKeywords = [
      'understand', 'sorry', 'apologize', 'help', 'support', 'appreciate',
      'empathize', 'concern', 'worry', 'difficult', 'challenging', 'feel',
      'listen', 'care', 'assist', 'comfort', 'reassure'
    ];

    const words = message.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word =>
      empathyKeywords.some(keyword => word.includes(keyword))
    ).length;

    let score = 60 + (keywordCount * 8) + Math.min(words.length / 10, 15);
    return Math.min(Math.max(Math.round(score), 45), 100);
  },

  generateAIResponse(userMessage, empathyScore) {
    const responses = {
      high: [
        "Thank you so much for being understanding. Your empathetic approach really helps.",
        "I really appreciate how you explained that. It makes me feel much better.",
        "Your patience and understanding mean a lot to me. Thank you for listening.",
        "I feel much more confident now thanks to your helpful explanation."
      ],
      medium: [
        "That's helpful, thank you. I'm starting to understand better.",
        "Okay, I appreciate you looking into this for me.",
        "That makes sense. Can you tell me more about the next steps?",
        "I see. Thank you for clarifying that for me."
      ],
      low: [
        "I'm still not sure I understand. Can you explain this differently?",
        "This is still confusing to me. Are there other options?",
        "I don't think you're really hearing what I'm saying.",
        "That doesn't really address my main concern."
      ],
    };

    let category = 'medium';
    if (empathyScore >= 85) category = 'high';
    else if (empathyScore < 70) category = 'low';

    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  },

  generateFeedback(empathyScore) {
    if (empathyScore >= 90) {
      return "Excellent empathy! Your response shows genuine care and understanding. Keep up the great work!";
    } else if (empathyScore >= 80) {
      return "Great empathy keywords used! Consider asking more open-ended questions to show deeper engagement.";
    } else if (empathyScore >= 70) {
      return "Good response! Try using more empathetic language like 'I understand how frustrating this must be.'";
    } else if (empathyScore >= 60) {
      return "Consider starting with empathy. Try phrases like 'I understand your frustration' or 'I can see why you'd feel that way.'";
    } else {
      return "Focus on acknowledging the customer's emotions first. Show that you care about their situation before providing solutions.";
    }
  },

  // Generate fallback help content
  generateHelpContent() {
    return `
# 💡 Training Tips & Help

## 🎯 Key Empathy Techniques
1. **Acknowledge Emotions**: Start by recognizing how the customer feels
2. **Use Empathetic Language**: "I understand", "I can see why", "That must be frustrating"
3. **Ask Open Questions**: "Can you tell me more about...", "How has this affected you?"
4. **Show Genuine Care**: Use phrases that demonstrate you want to help

## 🗣️ Effective Phrases to Use
- "I understand how frustrating this must be"
- "I can see why you'd feel that way"
- "Let me help you resolve this"
- "I want to make sure we address your concerns"
- "Thank you for bringing this to my attention"

## 🚀 Pro Tips
- Listen actively before offering solutions
- Validate their emotions before explaining policies
- Use their name when appropriate
- Stay patient and professional throughout

Keep practicing these techniques to improve your empathy score!
    `;
  },

  // Generate fallback evaluation content
  generateEvaluationContent(messageCount = 0, duration = 0) {
    const score = Math.max(75, Math.min(95, 70 + messageCount * 3));
    return `
# 📊 Performance Evaluation

## Overall Score: **${score}%**

## Performance Summary
- **Messages Exchanged**: ${messageCount}
- **Session Duration**: ${Math.floor(duration / 60)}m ${duration % 60}s
- **Communication Style**: Professional and engaging
- **Empathy Level**: ${score >= 85 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Improvement'}

## 🌟 Strengths Observed
- Maintained professional tone throughout the session
- Demonstrated willingness to help the customer
- Used appropriate business language

## 🚀 Areas for Improvement
- Continue practicing empathetic language
- Ask more clarifying questions to understand customer needs
- Acknowledge customer emotions before providing solutions

## Final Recommendations
${score >= 85
        ? 'Excellent work! Your empathy skills are well-developed. Keep practicing to maintain this level.'
        : score >= 75
          ? 'Good progress! Focus on using more empathetic phrases and active listening.'
          : 'Keep practicing! Start conversations by acknowledging customer emotions and showing genuine care.'
      }
    `;
  }
};

export default apiService;
