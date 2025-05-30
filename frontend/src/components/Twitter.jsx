import apiClient from "../utils/apiClient";
import { useEffect, useState } from "react";
import { FiUsers, FiMessageSquare, FiHeart, FiRefreshCw, FiCalendar } from "react-icons/fi";
import { ChartCard, Button, MetricCard, ConnectTwitterCard } from "../components";

function Twitter() {
  const [isConnected, setIsConnected] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [topStats, setTopStats] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get("/twitter/status");
      setIsConnected(res.data.connected);
      if (res.data.data.length > 0) {
        setStats(res.data.data);
        setTopStats(res.data.data[res.data.data.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching Twitter status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);


  const refreshStats = async () => {
    try {
      await apiClient.post("/twitter/refresh/");
      fetchStatus();
    }
    catch (error) {
      console.error("Error refreshing Twitter stats:", error);
    }
  };

  // Format date if needed (assuming stats[].timestamp is ISO or "DD-MM-YYYY")
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
      // "DD-MM-YYYY" to "YYYY-MM-DD"
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  // Prepare data for ChartCard
  const getChartData = (key) =>
    Array.isArray(stats)
      ? stats
        .filter((item) => typeof item[key] === "number" || !isNaN(Number(item[key])))
        .map((item) => ({
          value: Number(item[key]) || 0,
          date: formatDate(item.timestamp),
        }))
      : [];

  if (!stats) {
    return <div>Loading...</div>;
  }

  if (Loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {isConnected ? (
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Twitter Insights</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-1" />
                {topStats && (
                  <span>Last updated: {topStats.timestamp}</span>
                )}
              </div>
            </div>
            <div className="flex items-center relative">
              <Button onClick={refreshStats} className="" variant="outline" size="md" icon={<FiRefreshCw className="w-4 h-4" />}>
                Refresh Data
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topStats ? (
              <>
                <MetricCard
                  title="Followers"
                  metric={{
                    value: topStats.followers_count || 0,
                    change: 0,
                    trend: 'neutral',
                  }}
                  icon={<FiUsers className="text-2xl" />}
                />
                <MetricCard
                  title="Tweets"
                  metric={{
                    value: topStats.tweets_count || 0,
                    change: 0,
                    trend: 'neutral',
                  }}
                  icon={<FiMessageSquare className="text-2xl" />}
                />
                <MetricCard
                  title="Likes"
                  metric={{
                    value: topStats.likes_count || 0,
                    change: 0,
                    trend: 'neutral',
                  }}
                  icon={<FiHeart className="text-2xl" />}
                />
              </>
            ) : (
              <div>Loading metrics...</div>
            )}
          </div>
          {/* Chart Section */}
          <div className="mt-6 mb-4 grid grid-cols-2 gap-4">
            <ChartCard
              title="Followers Growth"
              data={getChartData("followers_count")}
              color="#3B82F6"
              timeframe="Last 30 days"
              height={300}
            />
            <ChartCard
              title="Tweets Growth"
              data={getChartData("tweets_count")}
              color="#10B981"
              timeframe="Last 30 days"
              height={300}
            />
            <ChartCard
              title="Likes Growth"
              data={getChartData("likes_count")}
              color="#F59E42"
              timeframe="Last 30 days"
              height={300}
            />
          </div>
        </div>
      ) : <ConnectTwitterCard />}
    </>
  );
}

export default Twitter;
