import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { FaTwitter } from "react-icons/fa";
import TwitterCard from "./connectCards/TwitterCard";
import ChartCard from "./charts/ChartCard";

function Twitter() {
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("twitter/stats/")
      .then(res => {
        setProfile(res.data.profile);
        setTweets(res.data.tweets);
        setTrends(res.data.trends);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Twitter analytics...</div>;
  if (!profile) return <TwitterCard />;

  // Prepare data for ChartCard (expects [{date, value}])
  const toChartData = (key) =>
    trends.map(t => ({ date: t.date, value: t[key] }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <FaTwitter className="text-blue-400 text-3xl mr-2" />
        <h2 className="text-xl font-bold">Twitter Analytics</h2>
      </div>
      <div className="mb-6">
        <div className="font-semibold">@{profile.username}</div>
        <div>Followers: {profile.followers_count}</div>
        <div>Total Tweets: {profile.tweets_count}</div>
        <div>Account Created: {profile.created_at && profile.created_at.slice(0, 10)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Tweets"
          data={toChartData("tweets")}
          color="#1DA1F2"
        />
        <ChartCard
          title="Likes"
          data={toChartData("likes")}
          color="#F59E42"
        />
        <ChartCard
          title="Views"
          data={toChartData("views")}
          color="#10B981"
        />
        <ChartCard
          title="Retweets"
          data={toChartData("retweets")}
          color="#6366F1"
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Recent Tweets</h3>
        <ul className="space-y-2">
          {tweets.slice(0, 10).map(t => (
            <li key={t.id} className="border rounded p-2">
              <div className="text-gray-800">{t.text}</div>
              <div className="text-xs text-gray-500">
                {t.created_at.slice(0, 10)} | Likes: {t.public_metrics.like_count} | Retweets: {t.public_metrics.retweet_count}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Twitter;