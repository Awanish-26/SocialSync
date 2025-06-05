import { FiTrendingUp, FiBarChart2, FiActivity, FiUsers } from 'react-icons/fi';
import Card from './ui/Card';
import ChartCard from './charts/ChartCard';
import LineChart from './charts/LineChart';
import { motion } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { useEffect } from 'react';

const OverviewCard = ({ title, value, trend, description, icon: Icon, data }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } transition-colors duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <h3 className={`mt-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`mt-1 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
      {data && (
        <div className="mt-4 h-16">
          <LineChart data={data} color="#6366F1" height={64} showAxis={false} />
        </div>
      )}
    </motion.div>
  );
};

function Overview({ data, onRequireOnboarding = () => {} }) {
  const { isDarkMode } = useTheme();

  // If onboarding callback is provided, call it if data is missing
  // Use useEffect to avoid hook order issues
  useEffect(() => {
    if (!data && typeof onRequireOnboarding === 'function') {
      onRequireOnboarding();
    }
  }, [data, onRequireOnboarding]);

  if (!data) {
    return null;
  }

  // --- Use YouTube page logic for Overview ---
  // Assume data.ytData is the same as Youtube.jsx's videos array
  // For charts, use the same trends as Youtube.jsx if available
  const channel = data.channel || {};
  const videos = data.ytData || [];
  const trends = data.trends || {
    subscribers: videos.map(v => ({ date: v.timestamp || v.last_updated, value: v.subscriber_count || 0 })),
    views: videos.map(v => ({ date: v.timestamp || v.last_updated, value: v.view_count || 0 })),
    engagement: videos.map(v => ({ date: v.timestamp || v.last_updated, value: (v.likes || 0) + (v.comments || 0) + (v.view_count || 0) })),
  };

  // Remove twEngagementTrend usage, use only YouTube trends for cards
  // If you want to show Twitter stats in the future, add similar logic for Twitter trends
  const twEngagementTrend = null; // Not used, placeholder to avoid ReferenceError

  // Trend calculations using only YouTube data
  const ytEngagementTrend = trends.engagement && trends.engagement.length > 1
    ? ((trends.engagement[trends.engagement.length - 1].value - trends.engagement[0].value) / (trends.engagement[0].value || 1) * 100).toFixed(1)
    : null;
  const ytSubscribersTrend = trends.subscribers && trends.subscribers.length > 1
    ? ((trends.subscribers[trends.subscribers.length - 1].value - trends.subscribers[0].value) / (trends.subscribers[0].value || 1) * 100).toFixed(1)
    : null;
  const ytViewsTrend = trends.views && trends.views.length > 1
    ? ((trends.views[trends.views.length - 1].value - trends.views[0].value) / (trends.views[0].value || 1) * 100).toFixed(1)
    : null;

  // Calculate audience growth trend (subscribers trend)
  const audienceGrowthTrend = ytSubscribersTrend;
  // Calculate average engagement rate from YouTube data
  const avgEngagementRate = trends.engagement && trends.engagement.length > 0
    ? (
        trends.engagement.reduce((a, b) => a + (b.value || 0), 0) / trends.engagement.length
      ).toFixed(1)
    : null;

  // Helper for fallback display
  const displayValue = (val, fallback = 'Not enough data') => (val === null || isNaN(val)) ? fallback : val;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Performance Overview
        </h2>
        <select 
          className={`px-3 py-1 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-300' 
              : 'bg-white border-gray-200 text-gray-700'
          }`}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewCard
          title="Total Engagement"
          value={displayValue(((channel.views || 0) + (channel.likes || 0)).toLocaleString(), 'No data')}
          trend={displayValue(Number(ytEngagementTrend), '-')}
          description="Views and likes across YouTube"
          icon={FiActivity}
        />
        <OverviewCard
          title="Audience Growth"
          value={displayValue((channel.subscribers || 0).toLocaleString(), 'No data')}
          trend={displayValue(audienceGrowthTrend, '-')}
          description="Total subscribers"
          icon={FiUsers}
        />
        <OverviewCard
          title="Content Performance"
          value={avgEngagementRate !== null ? avgEngagementRate + '%' : 'No data'}
          trend={avgEngagementRate !== null ? avgEngagementRate - 100 : '-'}
          description="Average engagement rate"
          icon={FiBarChart2}
        />
      </div>

      {/* Charts */}
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

      {/* Recent Videos Section */}
      {/* <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Recent Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => (
            <Card key={i} className="flex flex-col h-full">
              <img
                src={v.thumbnail || v.thumbnail_url || 'https://img.youtube.com/vi/' + (v.videoId || v.id || '') + '/hqdefault.jpg'}
                alt={v.title}
                className="w-full h-40 object-cover rounded-t-lg"
                onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail'; }}
              />
              <div className="flex-1 flex flex-col p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{v.title}</h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{v.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 text-xs text-gray-600">
                  <span>Views: <b>{v.view_count?.toLocaleString() || v.views?.toLocaleString() || 0}</b></span>
                  <span>Likes: <b>{v.likes?.toLocaleString() || 0}</b></span>
                  <span>Comments: <b>{v.comments?.toLocaleString() || 0}</b></span>
                  <span>Date: {v.timestamp ? new Date(v.timestamp).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Overview;