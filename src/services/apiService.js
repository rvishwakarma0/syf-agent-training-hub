import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://cld1z37z1e.execute-api.us-east-1.amazonaws.com/demo';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
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
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    // Handle CORS specifically
    if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
      console.error('🔒 CORS Error detected - API Gateway may need CORS configuration');
    }
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      console.error('🚫 Authentication Token Missing or Invalid');
    } else if (error.response?.status === 500) {
      console.error('💥 Internal Server Error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request Timeout');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Check internet connection');
    }
    
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Health Check - Using actual deployed endpoint
  async healthCheck() {
    try {
      // Use get-analysis endpoint as health check since it's deployed
      const response = await apiClient.get('/get-analysis/health-check-123');
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
          message: 'Health check completed (fallback)',
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  // Test direct API call without browser CORS
  async testApiDirect() {
    console.log('🧪 Testing direct API call to:', API_BASE_URL);
    
    try {
      // Test with your actual deployed endpoint - get-analysis with demo session
      const response = await fetch(`${API_BASE_URL}/get-analysis/demo-test-123`, {
        method: 'GET',
        mode: 'cors', // Explicitly request CORS
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Direct API test successful:', response.status);
      const data = await response.text();
      console.log('📋 Response data:', data);
      return { success: true, status: response.status, data };
    } catch (error) {
      console.log('❌ Direct API test failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Start Training Scenario
  async startScenario(scenarioData) {
    try {
      // Fixed payload structure to match your Lambda API
      const payload = {
        scenarioType: scenarioData.scenario || "customer_service", 
        emotion: "frustrated", // Default emotion
        difficultyLevel: "medium" // Default difficulty
      };

      console.log('Calling AWS Lambda /start-scenario with payload:', payload);
      const response = await apiClient.post('/start-scenario', payload);
      
      // Handle your specific response structure
      if (response.data && response.data.body) {
        const responseBody = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
          
        return {
          success: responseBody.success,
          data: {
            sessionId: responseBody.sessionId,
            scenario: responseBody.scenarioDescription,
            initialMessage: responseBody.initialMessage,
            customerEmotion: 'frustrated',
            success: responseBody.success
          },
        };
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.warn('Start Scenario API failed, using fallback response:', error.message);
      
      // Fallback response for demo purposes
      return {
        success: true,
        data: {
          sessionId: `session-${Date.now()}`,
          scenario: scenarioData.scenario,
          initialMessage: this.getScenarioMessage(scenarioData.scenario),
          customerEmotion: 'frustrated',
          difficulty: this.getScenarioDifficulty(scenarioData.scenario),
          success: true,
        },
        fallback: true,
      };
    }
  },

  // Send Message
  async sendMessage(messageData) {
    try {
      // Fixed payload structure to match your Lambda API
      const payload = {
        sessionId: messageData.sessionId,
        message: messageData.message
      };

      console.log('Calling AWS Lambda /send-message with payload:', payload);
      const response = await apiClient.post('/send-message', payload);
      
      // Handle your specific response structure
      if (response.data && response.data.body) {
        const responseBody = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
          
        return {
          success: responseBody.success,
          data: {
            sessionId: responseBody.sessionId || messageData.sessionId,
            empathyScore: responseBody.empathyScore,
            responseTime: responseBody.responseTimeMs / 1000, // Convert to seconds
            aiResponse: responseBody.aiResponse,
            feedback: responseBody.feedback,
            timeFeedback: responseBody.timeFeedback,
            responseTimeAnalysis: responseBody.responseTimeAnalysis,
            success: responseBody.success
          },
        };
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.warn('Send Message API failed, using fallback response:', error.message);
      
      // Fallback response with simulated empathy scoring
      const empathyScore = this.calculateEmpathyScore(messageData.message);
      
      return {
        success: true,
        data: {
          sessionId: messageData.sessionId,
          empathyScore: empathyScore,
          responseTime: Math.random() * 3 + 1, // 1-4 seconds
          aiResponse: this.generateAIResponse(messageData.message, empathyScore),
          feedback: this.generateFeedback(empathyScore),
          keywords: this.extractEmpathyKeywords(messageData.message),
          success: true,
        },
        fallback: true,
      };
    }
  },

  // Get Analysis
  async getAnalysis(sessionId) {
    try {
      console.log('Calling AWS Lambda /get-analysis for sessionId:', sessionId);
      const response = await apiClient.get(`/get-analysis/${sessionId}`);
      
      // Handle your specific response structure
      if (response.data && response.data.body) {
        const responseBody = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
          
        return {
          success: responseBody.success,
          data: {
            sessionId: responseBody.sessionId,
            overallScore: responseBody.overallScore,
            totalMessages: responseBody.totalMessages,
            suggestions: responseBody.suggestions,
            summary: responseBody.summary,
            success: responseBody.success
          },
        };
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.warn('Get Analysis API failed, using fallback response:', error.message);
      
      // Fallback response for demo purposes
      return {
        success: true,
        data: {
          sessionId: sessionId,
          overallScore: Math.floor(Math.random() * 20) + 80, // 80-100
          totalMessages: Math.floor(Math.random() * 10) + 5, // 5-15
          averageResponseTime: Math.random() * 2 + 1.5, // 1.5-3.5 seconds
          empathyKeywords: ['understand', 'apologize', 'help', 'sorry', 'appreciate'],
          strengths: [
            'Excellent use of empathy keywords',
            'Professional tone maintained',
            'Quick response times',
          ],
          improvements: [
            'Ask more open-ended questions',
            'Use customer name more frequently',
            'Provide more specific solutions',
          ],
          sessionDuration: this.formatDuration(Math.random() * 20 + 10), // 10-30 minutes
          customerSatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100
          recommendation: 'Ready for advanced scenarios',
        },
        fallback: true,
      };
    }
  },

  // Helper Functions for Fallback Responses
  getScenarioMessage(scenario) {
    const scenarios = {
      'billing_issue': "I'm really confused about this charge on my bill. I never signed up for premium support, but I'm being charged $49.99 every month. This is really frustrating!",
      'customer_complaint': "I've been trying to resolve this issue for weeks now, and nobody seems to be able to help me. I'm considering switching to another bank entirely!",
      'workplace_conflict': "There's been some tension with my colleagues lately, and it's affecting my work performance. I'm not sure how to handle this situation professionally.",
      'technical_support': "I can't access my online banking account. I keep getting error messages, and I need to pay some bills urgently. Can you help me figure this out?",
      'family_crisis': "I'm going through a difficult time with my family right now, and it's impacting my ability to focus at work. I need some guidance on available support resources.",
      'medical_concern': "I have some health issues that might require extended time off work. I'm worried about how this will affect my job security and benefits.",
      'financial_stress': "I'm struggling to make ends meet with my current salary, and I'm considering taking on additional work. How can the company support me during this difficult time?",
      'relationship_issue': "I'm having relationship problems that are affecting my mental health and work performance. I need advice on work-life balance and available counseling services.",
    };
    
    return scenarios[scenario] || "I have a concern that I'd like to discuss with you. Can you help me understand my options?";
  },

  getScenarioDifficulty(scenario) {
    const difficulties = {
      'billing_issue': 6,
      'customer_complaint': 8,
      'workplace_conflict': 7,
      'technical_support': 4,
      'family_crisis': 9,
      'medical_concern': 8,
      'financial_stress': 7,
      'relationship_issue': 9,
    };
    
    return difficulties[scenario] || 5;
  },

  calculateEmpathyScore(message) {
    const empathyKeywords = [
      'understand', 'sorry', 'apologize', 'help', 'support', 'appreciate',
      'empathize', 'concern', 'worry', 'difficult', 'challenging', 'frustrated',
      'feel', 'important', 'priority', 'care', 'assist', 'resolve'
    ];
    
    const words = message.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => 
      empathyKeywords.some(keyword => word.includes(keyword))
    ).length;
    
    // Base score + bonus for keywords + bonus for length + random variation
    let score = 60 + (keywordCount * 8) + Math.min(words.length / 10, 15) + Math.random() * 10;
    
    // Ensure score is between 45 and 100
    return Math.min(Math.max(Math.round(score), 45), 100);
  },

  extractEmpathyKeywords(message) {
    const empathyKeywords = [
      'understand', 'sorry', 'apologize', 'help', 'support', 'appreciate',
      'empathize', 'concern', 'assist', 'resolve'
    ];
    
    const words = message.toLowerCase().split(/\s+/);
    return empathyKeywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    );
  },

  generateAIResponse(userMessage, empathyScore) {
    const responses = {
      high: [ // 85+
        "Thank you so much for being so understanding and patient with me. Your empathetic approach really helps.",
        "I really appreciate how you explained that. It makes me feel much better about the situation.",
        "You've been incredibly helpful and kind. I feel confident that we can resolve this together.",
      ],
      medium: [ // 70-84
        "That's helpful, thank you. I'm starting to understand the situation better.",
        "Okay, I appreciate you looking into this for me. What are the next steps?",
        "I understand. Can you help me figure out what I need to do to fix this?",
      ],
      low: [ // Below 70
        "I'm still not sure I understand. Can you explain this differently?",
        "This is still confusing to me. Are there other options available?",
        "I'm getting frustrated because this doesn't seem to be helping my situation.",
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
      return "Good response! Try using more empathetic language like 'I understand' or 'I appreciate'.";
    } else if (empathyScore >= 60) {
      return "Room for improvement. Focus on acknowledging the customer's feelings first.";
    } else {
      return "Consider starting with empathy. Try phrases like 'I understand your frustration' or 'I'm sorry you're experiencing this'.";
    }
  },

  formatDuration(minutes) {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}m ${secs}s`;
  },
};

export default apiService;
