import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { ChartCard, ConnectYoutube } from "../components";

function Youtube() {
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
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{channel.title}</h1>
        <p className="text-gray-500">{channel.description}</p>
        <div className="flex gap-6 mt-2 text-gray-700">
          <span>Subscribers: <b>{channel.subscribers}</b></span>
          <span>Views: <b>{channel.views}</b></span>
          <span>Videos: <b>{channel.videoCount}</b></span>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <ChartCard
          title="Engagement Trend"
          data={Array.isArray(trends.engagement) ? trends.engagement : []}
          color="#F59E42"
          timeframe="Last 30 days"
          className="h-full"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Recent Videos</h2>
        <ul>
          {videos.map((v, i) => (
            <li key={i} className="mb-2">
              <strong>{v.title}</strong> - {v.views} views, {v.likes} likes, {v.comments} comments
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Youtube;