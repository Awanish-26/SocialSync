import { useState } from "react";
import apiClient from "../../utils/apiClient";
import { FaInstagram } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ConnectInstagramCard() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await apiClient.post("/instagram/connect/", formData);
      setMessage(res.data.message);
      window.location.reload(); // Refresh page to load InstagramInsights
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect Instagram account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-stretch w-full max-w-md shadow-md justify-center border-2 border-dashed rounded-lg p-8 transition ${
        isDarkMode
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-300 text-black"
      } hover:shadow-lg`}
    >
      <FaInstagram className="text-red-400 text-5xl mb-4 align-middle self-center" />
      <h2 className="text-2xl font-semibold text-center mb-4">
        Connect Instagram Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg mb-1">Instagram Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your Instagram username"
            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />
        </div>
        <div>
          <label className="block text-lg mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your Instagram password"
            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="agreement"
            id="instagram-agreement"
            required
          />
          <label
            htmlFor="instagram-agreement"
            className="ml-2 text-sm text-gray-500"
          >
            I agree to the terms and conditions
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-2 rounded hover:from-pink-600 hover:to-yellow-600 transition disabled:opacity-60"
        >
          {loading ? "Connecting..." : "Connect with Instagram"}
        </button>
        {message && (
          <div className="text-center text-sm mt-2">{message}</div>
        )}
      </form>
    </div>
  );
}

export default ConnectInstagramCard;
