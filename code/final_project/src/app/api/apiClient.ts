import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5001/api';

// API client for patient-related operations
export const patientApi = {
  // Search patients by query (name or ID)
  searchPatients: async (query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, { query });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  },

  // Get patient details by ID
  getPatientDetails: async (patientId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patient-details`, { patient_id: patientId });
      return response.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  },

  // Get patient history
  getPatientHistory: async (patientId, startDate, endDate) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patientHistory`, {
        patient_id: patientId,
        start_date: startDate,
        end_date: endDate
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patient history:', error);
      throw error;
    }
  },

  // Save patient history
  savePatientHistory: async (patientId, historyDetails, date) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/savePatientHistory`, {
        patient_id: patientId,
        historyDetails,
        date
      });
      return response.data;
    } catch (error) {
      console.error('Error saving patient history:', error);
      throw error;
    }
  },

  // Get patient data
  getPatientData: async (patientId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patientData`, {
        patient_id: patientId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patient data:', error);
      throw error;
    }
  }
};

// API client for authentication
export const authApi = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Register user
  register: async (email, password, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { email, password, name });
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
};

// API client for letter generation
export const letterApi = {
  // Generate clinical letter
  generateLetter: async (patientId, letterType, content) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-letter`, {
        patient_id: patientId,
        letter_type: letterType,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error generating letter:', error);
      throw error;
    }
  },

  // Get sample names (demo function)
  getSampleNames: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/names`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sample names:', error);
      throw error;
    }
  }
};

// Export all API clients
export default {
  patient: patientApi,
  auth: authApi,
  letter: letterApi
};
