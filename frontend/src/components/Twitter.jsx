import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { FaTwitter } from "react-icons/fa";
import TwitterCard from "./connectCards/TwitterCard";
import ChartCard from "./charts/ChartCard";
import { useTheme } from "./context/ThemeContext";

function Twitter() {
  const { isDarkMode } = useTheme();
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
  if (!profile) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TwitterCard />
      </div>
    );
  }

  // Prepare data for ChartCard (expects [{date, value}])
  const toChartData = (key) =>
    trends.map(t => ({ date: t.date, value: t[key] }));

  return (
    <div className={`min-h-[80vh] flex items-center justify-center w-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="flex items-center mb-4">
          <FaTwitter className="text-blue-400 text-3xl mr-2" />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Twitter Analytics</h2>
        </div>
        <div className={`mb-6 w-full text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}> 
          <div className="font-semibold">@{profile.username}</div>
          <div>Followers: {profile.followers_count}</div>
          <div>Total Tweets: {profile.tweets_count}</div>
          <div>Account Created: {profile.created_at && profile.created_at.slice(0, 10)}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
          <ChartCard
            title="Tweets"
            data={toChartData("tweets")}
            color="#1DA1F2"
            className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          />
          <ChartCard
            title="Likes"
            data={toChartData("likes")}
            color="#F59E42"
            className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          />
          <ChartCard
            title="Views"
            data={toChartData("views")}
            color="#10B981"
            className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          />
          <ChartCard
            title="Retweets"
            data={toChartData("retweets")}
            color="#6366F1"
            className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          />
        </div>
        <div className="w-full">
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Tweets</h3>
          <ul className="space-y-2">
            {tweets.slice(0, 10).map(t => (
              <li key={t.id} className={`border rounded p-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}> 
                <div>{t.text}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.created_at.slice(0, 10)} | Likes: {t.public_metrics.like_count} | Retweets: {t.public_metrics.retweet_count}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Twitter;