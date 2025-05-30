import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { FiUsers, FiEye, FiVideo, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import { MetricCard, Button, ChartCard, ConnectYoutube } from "../components"


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

  // Converts "30-05-2025" to "2025-05-30" and match the format used in data parsing
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const getChartData = (key) =>
    Array.isArray(data)
      ? data
        .filter((item) => typeof item[key] === "number" || !isNaN(Number(item[key])))
        .map((item) => ({
          value: Number(item[key]) || 0,
          date: formatDate(item.last_updated),
        }
        ))
      : [];
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
            <MetricCard title="Subscribers" metric={{ value: lateststats.subscriber_count, change: 0, trend: 'neutral', }} icon={<FiUsers className="text-2xl" />} />
            <MetricCard title="Views" metric={{ value: lateststats.view_count, change: 0, trend: 'up', }} icon={<FiEye className="text-2xl" />} />
            <MetricCard title="Videos" metric={{ value: lateststats.video_count, change: 0, trend: 'down', }} icon={<FiVideo className="text-2xl" />} />
          </div>
          <div className="mt-6 mb-4 grid grid-cols-2 gap-4">
            <ChartCard title="Subscribers Growth" data={getChartData("subscriber_count")} color="#3B82F6" timeframe="Last 30 days" height={300} />
            <ChartCard title="Views Growth" data={getChartData("view_count")} color="#10B981" timeframe="Last 30 days" height={300} />
            <ChartCard title="Videos Growth" data={getChartData("video_count")} color="#F59E42" timeframe="Last 30 days" height={300} />
          </div>
        </div>
      ) : (
        <ConnectYoutube />
      )}
    </>
  );
}

export default Youtube;
