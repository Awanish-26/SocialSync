import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import ConnectInstagram from "./connectcards/InstagramCard";
import { useTheme } from "./context/ThemeContext";


function Instagram() {
  const { isDarkMode } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get("api/instagram/status");
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
      <div className={`p-6 min-h-[60vh] flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Loading...</p>
      </div>
    );
  }
  return (
    <div className={`min-h-[80vh] flex items-center justify-center w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {isConnected ? (
        <div className={`w-full max-w-2xl flex flex-col items-center`}>
          <div className={`p-8 rounded-xl border w-full text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <h1 className="text-2xl font-bold mb-2">Instagram Insights</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>insights logic is here</p>
          </div>
        </div>
      ) : (
        <ConnectInstagram />
      )}
    </div>
  );
}

export default Instagram;
