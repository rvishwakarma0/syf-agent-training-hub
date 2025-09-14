import axios from 'axios';
import { TPOD_API_BASE_URL } from '../urlConfig';

const TpOdService = {
  // Get all TPODs
  getAllTpOds: async () => {
    try {
      const response = await axios.get(TPOD_API_BASE_URL);
      return {
        success: true,
        data: response.data,
        message: 'TPODs fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch TPODs'
      };
    }
  },

  // Get TPOD by ID
  getTpOdById: async (id) => {
    try {
      const response = await axios.get(`${TPOD_API_BASE_URL}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'TPOD fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch TPOD'
      };
    }
  },

  // Create new TPOD
  createTpOd: async (tpodData) => {
    try {
      const response = await axios.post(TPOD_API_BASE_URL, tpodData);
      return {
        success: true,
        data: response.data,
        message: 'TPOD created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create TPOD'
      };
    }
  },

  // Update TPOD
  updateTpOd: async (id, tpodData) => {
    try {
      const response = await axios.put(`${TPOD_API_BASE_URL}/${id}`, tpodData);
      return {
        success: true,
        data: response.data,
        message: 'TPOD updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update TPOD'
      };
    }
  },

  // Delete TPOD
  deleteTpOd: async (id) => {
    try {
      await axios.delete(`${TPOD_API_BASE_URL}/${id}`);
      return {
        success: true,
        message: 'TPOD deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete TPOD'
      };
    }
  },

  // Search TPODs (if you implement backend search)
  searchTpOds: async (keyword) => {
    try {
      const response = await axios.get(`${TPOD_API_BASE_URL}/search?keyword=${keyword}`);
      return {
        success: true,
        data: response.data,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Search failed'
      };
    }
  }
};

export default TpOdService;
