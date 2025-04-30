import { useState, useEffect } from "react";
import axios from "axios";
import ConnectYoutube from "./cards/ConnectYoutubeCard";
import YoutubeInsights from "./insights/YoutubeInsights"; // Create this component

function Youtube() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await axios.get("http://localhost:8000/api/youtube/status/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.connected) {
          setIsConnected(true);
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error checking YouTube connection", err);
      }
      setLoading(false);
    };

    fetchStatus();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <div className="w-full h-full ">
        {isConnected ? (
          <YoutubeInsights stats={stats} />
        ) : (
          <div className="flex justify-center items-center">
          <ConnectYoutube />
          </div>
        )}
      </div>
    </div>
  );
}

export default Youtube;
