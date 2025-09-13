import axios from 'axios';

// API Configuration - matches your Spring Boot backend
const PROMPT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://3.82.22.210:8080/api/prompts';

// Create axios instance with default config
const promptApiClient = axios.create({
  baseURL: PROMPT_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
promptApiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Prompt API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Prompt API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
promptApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Prompt API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Prompt API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Prompt Service Functions
export const PromptService = {
  // Get all prompts
  async getAllPrompts() {
    try {
      const response = await promptApiClient.get('');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch prompts:', error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  // Get prompt by ID
  async getPromptById(id) {
    try {
      const response = await promptApiClient.get(`/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Failed to fetch prompt ${id}:`, error.message);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  // Create new prompt
  async createPrompt(promptData) {
    try {
      const response = await promptApiClient.post('', promptData);
      return {
        success: true,
        data: response.data,
        message: 'Prompt created successfully',
      };
    } catch (error) {
      console.error('Failed to create prompt:', error.message);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create prompt',
      };
    }
  },

  // Update prompt
  async updatePrompt(id, promptData) {
    try {
      const response = await promptApiClient.put(`/${id}`, promptData);
      return {
        success: true,
        data: response.data,
        message: 'Prompt updated successfully',
      };
    } catch (error) {
      console.error(`Failed to update prompt ${id}:`, error.message);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update prompt',
      };
    }
  },

  // Delete prompt
  async deletePrompt(id) {
    try {
      const response = await promptApiClient.delete(`/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Prompt deleted successfully',
      };
    } catch (error) {
      console.error(`Failed to delete prompt ${id}:`, error.message);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete prompt',
      };
    }
  },

  // Search prompts
  async searchPrompts(keyword) {
    try {
      const response = await promptApiClient.get(`/search?keyword=${encodeURIComponent(keyword)}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to search prompts:', error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  // Get prompt statistics
  async getPromptStats() {
    try {
      const response = await promptApiClient.get('/stats');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch prompt stats:', error.message);
      return {
        success: false,
        error: error.message,
        data: { totalPrompts: 0, status: 'unavailable' },
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await promptApiClient.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Prompt service health check failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default PromptService;
