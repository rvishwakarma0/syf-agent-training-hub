import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://3.82.22.210:8080';
const API_URL = `${API_BASE_URL}/admin/api/tpods`;

const TpOdService = {
  // Get all TPODs
  getAllTpOds: async () => {
    try {
      const response = await axios.get(API_URL);
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
      const response = await axios.get(`${API_URL}/${id}`);
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
      const response = await axios.post(API_URL, tpodData);
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
      const response = await axios.put(`${API_URL}/${id}`, tpodData);
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
      await axios.delete(`${API_URL}/${id}`);
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
      const response = await axios.get(`${API_URL}/search?keyword=${keyword}`);
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
