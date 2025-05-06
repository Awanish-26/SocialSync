import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import ConnectTwitterCard from "./connectCards/TwitterCard";
import TwitterInsights from "./insights/TwitterInsights";

function Twitter() {
  const [isConnected, setIsConnected] = useState(false);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get("/twitter/status");
        setIsConnected(response.data.connected);
      } catch (error) {
        console.error("Error fetching Twitter status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (Loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {isConnected ? <TwitterInsights /> : <ConnectTwitterCard />}
    </>
  );
}

export default Twitter;
