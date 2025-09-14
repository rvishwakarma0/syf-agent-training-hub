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
};

export default apiService;
