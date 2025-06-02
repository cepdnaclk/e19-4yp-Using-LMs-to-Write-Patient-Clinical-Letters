import axiosInstance from "../interceptors/jwt-interceptor";

class PatientsService {
  async searchPatients(query) {
    try {
      const response = await axiosInstance.post("/search", { query });
      return response.data;
    } catch (error) {
      console.error("Error searching patients:", error);
      throw error;
    }
  }

  async getPatientDetails(patientId) {
    try {
      const response = await axiosInstance.post("/patient-details", {
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
      const response = await axiosInstance.post("/patientHistory", {
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
      const response = await axiosInstance.post("/savePatientHistory", {
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
      const response = await axiosInstance.post("/patientData", {
        patient_id: patientId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data:", error);
      throw error;
    }
  }
}

// Export a single instance of the class
const patientService = new PatientsService();
export default patientService;
