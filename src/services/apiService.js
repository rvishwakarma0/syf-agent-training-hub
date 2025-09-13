import axios from 'axios';

// API Configuration - Update to your Spring Boot server
const API_BASE_URL = 'http://localhost:8080/api'; // Change to your Spring Boot server URL

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
      };
    } catch (error) {
      console.warn('❌ Health Check failed:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: {
          status: 'healthy',
          message: 'Spring Boot API available',
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
          initialMessage: this.getScenarioMessage(scenarioData.scenario),
          customerEmotion: 'frustrated',
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
        tpodId: messageData.tpodId || 'customer-support-tpod', // You'll need to track this
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
          responseTime: 2.0, // You can calculate this
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
        },
        fallback: true,
      };
    }
  },

  // Get Session Analysis (you'll need to add this endpoint to Spring Boot)
  async getAnalysis(sessionId) {
    try {
      console.log('📊 Getting session analysis for:', sessionId);
      
      // You'll need to add this endpoint to your Spring Boot API
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

  // Helper Functions (keep existing ones)
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
      'empathize', 'concern', 'worry', 'difficult', 'challenging'
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
      ],
      medium: [
        "That's helpful, thank you. I'm starting to understand better.",
        "Okay, I appreciate you looking into this for me.",
      ],
      low: [
        "I'm still not sure I understand. Can you explain this differently?",
        "This is still confusing to me. Are there other options?",
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
      return "Excellent empathy! Your response shows genuine care and understanding.";
    } else if (empathyScore >= 80) {
      return "Great empathy keywords used! Consider asking more open-ended questions.";
    } else if (empathyScore >= 70) {
      return "Good response! Try using more empathetic language.";
    } else {
      return "Consider starting with empathy. Try phrases like 'I understand your frustration'.";
    }
  },
};

export default apiService;
