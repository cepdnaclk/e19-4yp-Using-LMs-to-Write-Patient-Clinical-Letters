import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiClientLetterApi {
  // ===== Patient APIs =====

  async searchPatients(query) {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, { query });
      return response.data;
    } catch (error) {
      console.error("Error searching patients:", error);
      throw error;
    }
  }

  async getPatientDetails(patientId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/patient-details`, {
        patient_id: patientId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient details:", error);
      throw error;
    }
  }

  async getPatientHistory(patientId, startDate, endDate) {
    try {
      const response = await axios.post(`${API_BASE_URL}/patientHistory`, {
        patient_id: patientId,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient history:", error);
      throw error;
    }
  }

  async savePatientHistory(patientId, historyDetails, date) {
    try {
      const response = await axios.post(`${API_BASE_URL}/savePatientHistory`, {
        patient_id: patientId,
        historyDetails,
        date,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving patient history:", error);
      throw error;
    }
  }

  async getPatientData(patientId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/patientData`, {
        patient_id: patientId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data:", error);
      throw error;
    }
  }

  // ===== Auth APIs =====

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async register(email, password, name) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }

  // ===== Letter APIs =====

  async generateLetter(patientId, letterType, content) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-letter`, {
        patient_id: patientId,
        letter_type: letterType,
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating letter:", error);
      throw error;
    }
  }

  async getSampleNames() {
    try {
      console.log("url:", API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/names`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sample names:", error);
      throw error;
    }
  }
}

// Export a single instance of the class
const letterApi = new ApiClientLetterApi();
export default letterApi;
