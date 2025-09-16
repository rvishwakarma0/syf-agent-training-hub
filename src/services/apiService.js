import axios from 'axios';
import { API_BASE_URL } from '../urlConfig';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000000,
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
  async healthCheck() {
    try {
      // Simple endpoint check - you can add a health endpoint to your Spring Boot app
      const response = await apiClient.get('/api/chat/health');
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
  async startPod({ tpodId, userId }) {
    try {
      const response = await apiClient.post('/api/chat/start-pod', {
        tpodId,
        userId,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('❌ Start Pod failed:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },
  
  async sendMessage({ sessionId, message, tpodId }) {
    try {
      const response = await apiClient.post('/api/chat/message', {
        sessionId,
        message,
        tpodId,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('❌ Send Message failed:', error);
      throw error;
    }
  },
// ✅ NEW: Get Feedback API Integration
  async getFeedback(payload) {
    try {
      // Validate required fields before making the request
      if (!payload.tpodId || !payload.messages || payload.messages.length === 0) {
        throw new Error('tpodId and messages are required');
      }

      console.log('📊 Requesting feedback for:', payload.tpodId);

      const response = await apiClient.post('/api/chat/get-feedback', payload);

      return {
        success: true,
        data: response.data,
        message: 'Feedback retrieved successfully'
      };
    } catch (error) {
      console.error('❌ Get Feedback API Error:', error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        return {
          success: false,
          error: 'Invalid request data',
          details: error.response.data?.message || 'Bad request',
          fallback: false
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          error: 'Server error occurred',
          details: error.response.data?.message || 'Internal server error',
          fallback: true
        };
      }

      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  },


};

export default apiService;
