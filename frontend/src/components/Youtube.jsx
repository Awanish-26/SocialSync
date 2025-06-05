import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { ChartCard, ConnectYoutube } from "../components";
import { useTheme } from "./context/ThemeContext";

function Youtube() {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("youtube/stats/")
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  console.log("Youtube stats:", stats);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!stats) return <ConnectYoutube />;

  const { channel, videos, trends } = stats;
  console.log(trends);
  return (
    <div className={`p-4 md:p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{channel.title}</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{channel.description}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscribers</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{channel.subscribers?.toLocaleString() || 0}</p>
        </div>
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{channel.views?.toLocaleString() || 0}</p>
        </div>
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Videos</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{channel.videoCount?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Trend Charts - fill the space with 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="Subscribers Trend"
          data={Array.isArray(trends.subscribers) ? trends.subscribers : []}
          color="#3B82F6"
          timeframe="Last 30 days"
          className="h-full"
        />
        <ChartCard
          title="Views Trend"
          data={Array.isArray(trends.views) ? trends.views : []}
          color="#10B981"
          timeframe="Last 30 days"
          className="h-full"
        />
      </div>

      <div>
        <h2 className={`text-xl font-semibold mt-6 mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Videos</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <li key={i} className={`rounded-xl border shadow-sm p-4 flex flex-col items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}> 
              {v.thumbnail && (
                <img src={v.thumbnail} alt={v.title} className="w-full h-40 object-cover rounded mb-2" />
              )}
              <strong className={`block mb-1 text-center ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>{v.title}</strong>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{v.views} views, {v.likes} likes, {v.comments} comments</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Youtube;