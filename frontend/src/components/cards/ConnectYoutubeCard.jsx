import { useState } from "react";
import apiClient from "../../utils/apiClient";
import { FaYoutube } from "react-icons/fa";
import YoutubeInsights from "../insights/YoutubeInsights";

function ConnectYoutube() {
  const [channelId, setChannelId] = useState("");
  const [stats, setStats] = useState(null); // Store YouTube stats
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/youtube/connect/", { channel_id: channelId });
      alert("YouTube connected successfully");
      // Fetch stats immediately after connection
      const res = await apiClient.get("/youtube/status/");
      if (res.data && res.data.connected) {
        setStats(res.data); // Set stats for immediate display
      } else {
        alert("Failed to fetch stats. Please try again.");
      }
    } catch (err) {
      alert("Error connecting to YouTube");
      console.error(err);
    }
    setLoading(false);
  };

  if (stats) {
    return <YoutubeInsights stats={stats} />; // Display YouTube stats
  }

  return (
    <form onSubmit={handleConnect} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:shadow-md transition">
      <FaYoutube className="text-red-400 text-5xl mb-4" />
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Connect Your YouTube Channel</h2>
      <input type="text" placeholder="Enter Channel ID" value={channelId} onChange={(e) => setChannelId(e.target.value)} required className="w-full px-4 py-2 mb-2 border border-gray-300 rounded" />
      <p className="text-sm text-gray-500 mb-4">You can find your Channel ID in the YouTube Studio under Settings - Advanced Settings.</p>
      <p className="text-sm text-gray-500 mb-4"> <b>OR</b> <a href="https://www.youtube.com/account_advanced" target="_blank" rel="noopener noreferrer" className="under">Youtube Account Settings</a></p>
      <div className="flex items-center mb-4">
        <input type="checkbox" name="agreement" id="yt-aggrement" required />
        <label htmlFor="agrement" className="ml-2 text-sm text-gray-500">I agree to the terms and conditions</label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 mb-2 py-2 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? "Connecting..." : "Connect YouTube"}
      </button>
    </form>
  );
}

export default ConnectYoutube;
