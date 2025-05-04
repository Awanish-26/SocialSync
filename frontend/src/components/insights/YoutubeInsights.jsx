import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { FiUsers, FiEye, FiVideo, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import apiClient from "../../utils/apiClient";
import MatrixCard from "../metrics/MetricCard";
import Button from "../ui/Button";


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
    <div className="mt-6 my-6 rounded relative">
      <div className="rounded">
        <h1 className="text-2xl font-bold text-gray-900"> {stats.title} </h1>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <FiCalendar className="w-4 h-4 mr-1" />
          <span>Last updated: {new Date(stats.last_updated).toLocaleString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <MatrixCard
          title="Subscribers"
          metric={{
            value: stats.subscriber_count,
            change: 0,
            trend: 'neutral',
          }}
          icon={<FiUsers className="text-2xl" />}
        />
        <MatrixCard
          title="Views"
          metric={{
            value: stats.view_count,
            change: 0,
            trend: 'up',
          }}
          icon={<FiEye className="text-2xl" />}
        />
        <MatrixCard
          title="Videos"
          metric={{
            value: stats.video_count,
            change: 0,
            trend: 'down',
          }}
          icon={<FiVideo className="text-2xl" />}
        />
        <div className="flex items-center relative">
          <Button onClick={refreshStats} className="absolute right-0 top-0" variant="outline" size="md" icon={<FiRefreshCw className="w-4 h-4" />}>Refresh Data</Button>
        </div>
      </div>
      <div className="mt-6 mb-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Subscribers Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="recorded_at" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="subscriber_count" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Views Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="recorded_at" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="view_count" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Videos Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="recorded_at" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="video_count" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default YoutubeInsights;
