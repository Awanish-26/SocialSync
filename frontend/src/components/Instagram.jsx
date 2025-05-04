import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import ConnectInstagram from "./cards/ConnectInstagramCard";
import InstagramInsights from "./insights/InstagramInsights";


function Instagram() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get("/instagram/status");
        setIsConnected(response.data.connected);
      } catch (error) {
        console.error("Error fetching Instagram status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="w-full h-full flex justify-center items-center">
        {isConnected ? (
          <InstagramInsights />
        ) : (<ConnectInstagram />)
        }
      </div>
    </div>
  );
}

export default Instagram;
