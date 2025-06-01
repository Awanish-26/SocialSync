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
    return platformData.map(item => ({
      date: new Date(item.timestamp || item.last_updated).toISOString(),
      value: item[key] || 0
    }));
  };

  // Calculate total engagement trend
  const calculateTrend = (data, key) => {
    if (data.length < 2) return 0;
    const first = data[0][key] || 0;
    const last = data[data.length - 1][key] || 0;
    return first === 0 ? 0 : ((last - first) / first * 100).toFixed(1);
  };

  const ytEngagementTrend = calculateTrend(data.ytData, 'view_count');
  const twEngagementTrend = calculateTrend(data.twData, 'likes_count');
  
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
          value={`${(data.totalViews + data.totalLikes).toLocaleString()}`}
          trend={Number(ytEngagementTrend) + Number(twEngagementTrend)}
          description="Views and likes across platforms"
          icon={FiActivity}
        />
        <OverviewCard
          title="Audience Growth"
          value={data.totalFollowers.toLocaleString()}
          trend={8.3}
          description="Total followers and subscribers"
          icon={FiUsers}
        />
        <OverviewCard
          title="Content Performance"
          value="92%"
          trend={-2.1}
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
          {[
            { platform: 'Instagram', percentage: 45, color: 'bg-pink-500' },
            { platform: 'Twitter', percentage: 30, color: 'bg-blue-500' },
            { platform: 'YouTube', percentage: 25, color: 'bg-red-500' }
          ].map((platform) => (
            <div key={platform.platform} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {platform.platform}
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {platform.percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${platform.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${platform.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Overview;