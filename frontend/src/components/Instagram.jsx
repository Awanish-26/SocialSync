import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import ConnectInstagram from "./connectcards/InstagramCard";


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
    <>
      {isConnected ? (
        <div className="p-6">
          <div className="w-full h-full flex justify-center items-center">
            <h1>insights logic is here</h1>
          </div>
        </div>
      ) : (<ConnectInstagram />)
      }
    </>
  );
}

export default Instagram;
