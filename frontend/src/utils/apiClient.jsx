import axios from "axios";
import { refreshToken } from "./auth";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/",
});

// Add a request interceptor to refresh the token before every request
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const newToken = await refreshToken(); // Refresh the token
            config.headers["Authorization"] = `Bearer ${newToken}`; // Set the new token
        } catch (err) {
            console.error("Error refreshing token:", err);
            // If refresh fails, clear tokens and redirect to login
            localStorage.clear();
            window.location.href = "/login";
            throw err;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Handle responses and errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API error:", error.response || error.message);
        return Promise.reject(error); // Return the error for further handling
    }
);

export default apiClient;