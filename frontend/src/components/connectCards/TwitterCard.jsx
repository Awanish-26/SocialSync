import { useState } from "react";
import apiClient from "../../utils/apiClient";
import { FaTwitter } from "react-icons/fa";
import Twitter from "../Twitter";

function ConnectTwitterCard() {
  const [formData, setFormData] = useState({
    access_token: "",
    access_token_secret: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false); // New state for connection status

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
      const res = await apiClient.post("/twitter/connect/", formData);
      if (res.status === 200) {
        setMessage("Twitter account connected successfully!");
        setIsConnected(true); // Update state to indicate successful connection
      } else {
        setMessage("Failed to connect Twitter account.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect Twitter account.");
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return <Twitter />; // Render Twitter component if connected
  }

  return (
    <div className="flex flex-col items-stretch w-full max-w-md shadow-md justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:shadow-md transition">
      <FaTwitter className="text-blue-400 text-5xl mb-4 align-middle self-center" />
      <h2 className="text-2xl font-semibold text-center mb-4">Connect Twitter Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg mb-1">Access Token</label>
          <input
            type="text"
            name="access_token"
            required
            value={formData.access_token}
            onChange={handleChange}
            placeholder="Enter your Twitter Access Token"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg mb-1">Access Token Secret</label>
          <input
            type="text"
            name="access_token_secret"
            required
            value={formData.access_token_secret}
            onChange={handleChange}
            placeholder="Enter your Twitter Access Token Secret"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
        {message && <p className="text-center mt-2 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

export default ConnectTwitterCard;