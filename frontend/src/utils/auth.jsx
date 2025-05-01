import axios from "axios";

export const refreshToken = async () => {
    try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token available");

        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh,
        });

        localStorage.setItem("access", response.data.access); // Update access token
        return response.data.access;
    } catch (err) {
        console.error("Failed to refresh token:", err);
        localStorage.clear(); // Clear tokens if refresh fails
        throw err; // Rethrow error to handle logout or redirection
    }
};

