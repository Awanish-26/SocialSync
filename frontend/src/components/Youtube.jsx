import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { FiUsers, FiEye, FiVideo, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import apiClient from "../utils/apiClient";
import MatrixCard from "./metrics/MetricCard";
import Button from "./ui/Button";
import ConnectYoutube from "./connectCards/YoutubeCard";

function Youtube() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [lateststats, setlatestStats] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get("/youtube/status/");
      if (res.data.connected) {
        setIsConnected(true);
        setData(res.data.data);
        setlatestStats(res.data.data[res.data.data.length - 1]);
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Error checking YouTube connection", err);
    }
    setLoading(false);
  };


  const refreshStats = async () => {
    try {
      await apiClient.post("/youtube/refresh/");
      fetchStatus();
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {isConnected ? (
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900"> {lateststats.title} </h1>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-1" />
                <span>Last updated: {new Date(lateststats.last_updated).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <Button onClick={refreshStats} className=" right-0 top-0" variant="outline" size="md" icon={<FiRefreshCw className="w-4 h-4" />}>Refresh Data</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MatrixCard
              title="Subscribers"
              metric={{
                value: lateststats.subscriber_count,
                change: 0,
                trend: 'neutral',
              }}
              icon={<FiUsers className="text-2xl" />}
            />
            <MatrixCard
              title="Views"
              metric={{
                value: lateststats.view_count,
                change: 0,
                trend: 'up',
              }}
              icon={<FiEye className="text-2xl" />}
            />
            <MatrixCard
              title="Videos"
              metric={{
                value: lateststats.video_count,
                change: 0,
                trend: 'down',
              }}
              icon={<FiVideo className="text-2xl" />}
            />

          </div>
          <div className="mt-6 mb-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">Subscribers Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="last_updated" />
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
                  <XAxis dataKey="last_updated" />
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
                  <XAxis dataKey="last_updated" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="video_count" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <ConnectYoutube />
      )}
    </>
  );
}

export default Youtube;
