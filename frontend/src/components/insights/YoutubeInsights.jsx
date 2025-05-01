import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { FaUsers, FaEye, FaVideo, FaRedo } from "react-icons/fa";
import apiClient from "../../utils/apiClient"; // Adjust the import path as necessary

function YoutubeInsights({ stats }) {
  const [data, setData] = useState([]);

  const fetchStats = async () => {
    const res = await apiClient.get("/youtube/stats/");
    setData(res.data);
  };

  const refreshStats = async () => {
    try {
      await apiClient.post("/youtube/refresh/");
      fetchStats();
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-white shadow p-6 rounded relative">
      <h2 className="text-2xl font-bold text-red-400 mb-4">{stats.title}</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded shadow">
          <FaUsers className="text-blue-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Subscribers</p>
            <p className="text-lg font-bold">{stats.subscriber_count}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded shadow">
          <FaEye className="text-green-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Views</p>
            <p className="text-lg font-bold">{stats.view_count}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded shadow">
          <FaVideo className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Videos</p>
            <p className="text-lg font-bold">{stats.video_count}</p>
          </div>
        </div>
        <div className="flex items-center relative">
          <button onClick={refreshStats} className=" absolute right-0 top-0 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FaRedo className="text-white text-sm mr-2" />
            Refresh Stats
          </button>
        </div>
      </div>
      <div className="mt-6 mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="recorded_at" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="subscriber_count" stroke="#8884d8" />
            <Line type="monotone" dataKey="view_count" stroke="#82ca9d" />
            <Line type="monotone" dataKey="video_count" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500">Last updated: {new Date(stats.last_updated).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default YoutubeInsights;
