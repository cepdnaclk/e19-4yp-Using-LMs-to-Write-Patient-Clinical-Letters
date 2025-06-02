import axiosInstance from "../interceptors/jwt-interceptor";

class LetterService {
  async generateLetter(patientId, letterType, content) {
    try {
      const response = await axiosInstance.post("/generate-letter", {
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
      const response = await axiosInstance.get("/names");
      return response.data;
    } catch (error) {
      console.error("Error fetching sample names:", error);
      throw error;
    }
  }
}

const letterService = new LetterService();
export default letterService;
