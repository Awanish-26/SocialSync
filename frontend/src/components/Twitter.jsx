import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import ConnectTwitterCard from "./cards/ConnectTwitterCard";
import TwitterInsights from "./insights/TwitterInsights";

function Twitter() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get("/twitter/status");
        setIsConnected(response.data.connected);
      } catch (error) {
        console.error("Error fetching Twitter status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 rounded shadow">
        <div className="w-full h-full flex justify-center items-center text-gray-600">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded shadow">
      <div className="w-full h-full flex justify-center items-center">
        {isConnected ? <TwitterInsights /> : <ConnectTwitterCard />}
      </div>
    </div>
  );
}

export default Twitter;
