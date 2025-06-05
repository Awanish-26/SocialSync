import axios from "axios";
import { refreshToken } from "./auth";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/",
});

// Add a request interceptor to set the access token from localStorage
apiClient.interceptors.request.use(
    async (config) => {
        // Use access token from localStorage if available
        const access = localStorage.getItem("access");
        if (access) {
            config.headers["Authorization"] = `Bearer ${access}`;
            return config;
        }
        // If no access token, try to refresh
        try {
            const newToken = await refreshToken();
            config.headers["Authorization"] = `Bearer ${newToken}`;
        } catch (err) {
            console.error("Error refreshing token:", err);
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