import { useState, useEffect } from "react";
import ConnectYoutube from "./cards/ConnectYoutubeCard";
import YoutubeInsights from "./insights/YoutubeInsights";
import apiClient from "../utils/apiClient";

function Youtube() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get("/youtube/status/");
        if (res.data && res.data.connected) {
          setIsConnected(true);
          setStats(res.data);
        } else {
          setIsConnected(false);
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
