import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { FiUsers, FiEye, FiVideo, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import { MetricCard, Button, ChartCard, ConnectYoutube } from "../components"


function Youtube() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("youtube/stats/")
      .then(res => {
        setStats(res.data);
        setLoading(false);
        console.log(res.data)
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!stats) return <ConnectYoutube />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{stats.channel.title}</h1>
        <p className="text-gray-500">{stats.channel.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <MetricCard title="Subscribers" metric={{ value: stats.channel.subscribers }} icon={<FiUsers className="text-2xl" />} />
        <MetricCard title="Views" metric={{ value: stats.channel.views }} icon={<FiEye className="text-2xl" />} />
        <MetricCard title="Videos" metric={{ value: stats.channel.videoCount }} icon={<FiVideo className="text-2xl" />} /> */}
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Recent Videos</h2>
        <ul>
          {stats.videos.map((v, i) => (
            <li key={i} className="mb-2">
              <strong>{v.title}</strong> - {v.views} views, {v.likes} likes, {v.comments} comments
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => {
          apiClient.post("youtube/disconnect/")
            .then(() => setStats(null));
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
      >
        Disconnect YouTube
      </Button>

    </div>
  );
}

export default Youtube;
