import axiosInstance from "../interceptors/jwt-interceptor";

class AuthService {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/login", {
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
      const response = await axiosInstance.post("/register", {
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

  async refreshTokens() {
    try {
      throw Error("Not Implemented");
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService();
export default authService;
