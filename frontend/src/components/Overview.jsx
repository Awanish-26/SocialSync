import { FiTrendingUp, FiBarChart2, FiActivity, FiUsers } from 'react-icons/fi';
import Card from './ui/Card';
import ChartCard from './charts/ChartCard';
import LineChart from './charts/LineChart';
import { motion } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

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

function Overview({ data }) {
  const { isDarkMode } = useTheme();

  // Process data for charts
  const getChartData = (platform, key) => {
    const platformData = platform === 'youtube' ? data.ytData : data.twData;
    if (!platformData || platformData.length === 0) return [];
    return platformData.map(item => ({
      date: new Date(item.timestamp || item.last_updated).toISOString(),
      value: item[key] || 0
    }));
  };

  // Calculate total engagement trend
  const calculateTrend = (dataArr, key) => {
    if (!dataArr || dataArr.length < 2) return null;
    const first = dataArr[0][key] || 0;
    const last = dataArr[dataArr.length - 1][key] || 0;
    return first === 0 ? null : ((last - first) / first * 100).toFixed(1);
  };

  // Use real data for trends and content performance
  const ytEngagementTrend = calculateTrend(data.ytData, 'view_count');
  const twEngagementTrend = calculateTrend(data.twData, 'likes_count');
  const audienceGrowthTrend = [calculateTrend(data.ytData, 'subscriber_count'), calculateTrend(data.twData, 'followers_count')]
    .filter(x => x !== null)
    .map(Number)
    .reduce((a, b) => a + b, 0);
  // Calculate average engagement rate from available data
  let engagementRates = [];
  if (data.ytData && data.ytData.length > 0) {
    engagementRates = engagementRates.concat(data.ytData.map(d => (d.likes || 0) / ((d.view_count || 1)) * 100));
  }
  if (data.twData && data.twData.length > 0) {
    engagementRates = engagementRates.concat(data.twData.map(d => (d.likes_count || 0) / ((d.views || 1)) * 100));
  }
  const avgEngagementRate = engagementRates.length > 0 ? (engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length).toFixed(1) : null;

  // Platform distribution (dynamic)
  const totalFollowers = (data.ytData?.[data.ytData.length-1]?.subscriber_count || 0) + (data.twData?.[data.twData.length-1]?.followers_count || 0);
  const ytPercent = totalFollowers ? Math.round(((data.ytData?.[data.ytData.length-1]?.subscriber_count || 0) / totalFollowers) * 100) : 0;
  const twPercent = totalFollowers ? Math.round(((data.twData?.[data.twData.length-1]?.followers_count || 0) / totalFollowers) * 100) : 0;
  const igPercent = 100 - ytPercent - twPercent;

  // Helper for fallback display
  const displayValue = (val, fallback = 'Not enough data') => (val === null || isNaN(val)) ? fallback : val;

  // For testing: inject dummy data if a query param is set or always for now
  if (window.location.search.includes('dummy') || true) {
    // Generate 100 dummy YouTube videos
    data.ytData = Array.from({ length: 100 }, (_, i) => ({
      timestamp: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
      view_count: 100000 + i * 1000,
      likes: 40000 + i * 100,
      subscriber_count: 10000 + i * 50,
      comments: 2000 + i * 10,
      title: `video_${i + 1}`
    }));
    // Generate 100 dummy Twitter stats
    data.twData = Array.from({ length: 100 }, (_, i) => ({
      timestamp: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
      followers_count: 5000 + i * 20,
      likes_count: 20000 + i * 50,
      views: 80000 + i * 500,
      comments: 1000 + i * 5,
      title: `tweet_${i + 1}`
    }));
    data.totalFollowers = (data.ytData[data.ytData.length-1].subscriber_count || 0) + (data.twData[data.twData.length-1].followers_count || 0);
    data.totalLikes = (data.ytData[data.ytData.length-1].likes || 0) + (data.twData[data.twData.length-1].likes_count || 0);
    data.totalViews = (data.ytData[data.ytData.length-1].view_count || 0) + (data.twData[data.twData.length-1].views || 0);
  }

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
          value={displayValue((data.totalViews + data.totalLikes).toLocaleString(), 'No data')}
          trend={displayValue(Number(ytEngagementTrend) + Number(twEngagementTrend), '-')}
          description="Views and likes across platforms"
          icon={FiActivity}
        />
        <OverviewCard
          title="Audience Growth"
          value={displayValue(data.totalFollowers.toLocaleString(), 'No data')}
          trend={displayValue(audienceGrowthTrend, '-')}
          description="Total followers and subscribers"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Total Followers Growth"
          data={[
            ...getChartData('youtube', 'subscriber_count'),
            ...getChartData('twitter', 'followers_count')
          ]}
          color="#6366F1"
          timeframe="Last 30 days"
          height={200}
          emptyMessage="Not enough data to display chart"
        />
        <ChartCard
          title="Total Engagement"
          data={[
            ...getChartData('youtube', 'view_count'),
            ...getChartData('twitter', 'likes_count')
          ]}
          color="#10B981"
          timeframe="Last 30 days"
          height={200}
          emptyMessage="Not enough data to display chart"
        />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Platform Distribution
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Instagram</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Twitter</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>YouTube</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Dynamic platform distribution */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Twitter</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{twPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${twPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>YouTube</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{ytPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${ytPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Instagram</span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{igPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${igPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-pink-500" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Overview;