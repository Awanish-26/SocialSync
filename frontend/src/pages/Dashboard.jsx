import { useState, useRef, useContext, useEffect } from "react";
import { Sidebar, Navbar, Analytics, Audience, Settings, Instagram, Facebook, Twitter, Youtube, SidebarContext, Button, Card, MetricsGrid, ChartCard, RecommendationCard } from "../components";
import { mockProfiles, getProfileMetrics, getTimeSeriesData, generateRecommendations } from "../utils/mockData";
import { FiCalendar, FiRefreshCw, FiDownload, FiUsers, FiEye, FiThumbsUp, FiTrendingUp, FiClock, FiVideo, FiBarChart2, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useApi from "../components/useApi";
import { Line, Bar } from 'recharts';

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const sidebarRef = useRef(null);
  const { isCollapsed } = useContext(SidebarContext);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '30days', '90days'

  // Fetch YouTube data
  const ytStatus = useApi('/youtube/status/');
  const ytHistory = useApi('/youtube/history/');
  const ytVideos = useApi('/youtube/videos/');

  useEffect(() => {
    // Set loading state based on API calls
    if (!ytStatus.loading && !ytHistory.loading && !ytVideos.loading) {
      setIsLoading(false);
    }
  }, [ytStatus.loading, ytHistory.loading, ytVideos.loading]);

  // Error handling
  if (ytStatus.error || ytHistory.error || ytVideos.error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">Please check your YouTube connection or try again later.</p>
        </div>
      </div>
    );
  }

  // Extract latest stats
  const latestStats = ytStatus.data?.data?.[ytStatus.data.data.length - 1] || {};
  
  // Process historical data for charts
  const processHistoricalData = () => {
    if (!ytHistory.data?.data) return [];
    
    return ytHistory.data.data.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      subscribers: item.subscriber_count,
      views: item.view_count,
      likes: item.likes
    }));
  };

  // Get top performing videos
  const getTopVideos = () => {
    if (!ytVideos.data?.data) return [];
    
    return ytVideos.data.data
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 3);
  };

  // Calculate growth rates
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const historicalData = processHistoricalData();
  const topVideos = getTopVideos();

  // Get previous period stats for comparison
  const previousStats = ytStatus.data?.data?.[ytStatus.data.data.length - 2] || {};

  const renderComponent = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics selectedProfile={selectedProfile} />;
      case "Audience":
        return <Audience selectedProfile={selectedProfile} />;
      case "Settings":
        return <Settings />;
      case "Instagram":
        return <Instagram />;
      case "Facebook":
        return <Facebook />;
      case "Twitter":
        return <Twitter />;
      case "Youtube":
        return <Youtube />;
      default:
        return (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    YouTube Analytics
                  </h1>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <FiClock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Last updated: {new Date(latestStats.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {/* Time range selector */}
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {/* Subscribers Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Subscribers</h3>
                  <FiUsers className="text-2xl opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{latestStats.subscriber_count?.toLocaleString()}</div>
                  <div className="flex items-center text-sm">
                    <FiTrendingUp className="mr-1" />
                    <span>{calculateGrowth(latestStats.subscriber_count, previousStats.subscriber_count)}% growth</span>
                  </div>
                </div>
              </motion.div>

              {/* Views Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Views</h3>
                  <FiEye className="text-2xl opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{latestStats.view_count?.toLocaleString()}</div>
                  <div className="flex items-center text-sm">
                    <FiTrendingUp className="mr-1" />
                    <span>{calculateGrowth(latestStats.view_count, previousStats.view_count)}% growth</span>
                  </div>
                </div>
              </motion.div>

              {/* Likes Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Likes</h3>
                  <FiThumbsUp className="text-2xl opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{latestStats.likes?.toLocaleString()}</div>
                  <div className="flex items-center text-sm">
                    <FiTrendingUp className="mr-1" />
                    <span>{calculateGrowth(latestStats.likes, previousStats.likes)}% growth</span>
                  </div>
                </div>
              </motion.div>

              {/* Videos Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold opacity-90">Total Videos</h3>
                  <FiVideo className="text-2xl opacity-80" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{latestStats.video_count?.toLocaleString()}</div>
                  <div className="flex items-center text-sm">
                    <FiActivity className="mr-1" />
                    <span>Active Channel</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Charts Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Subscriber Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscriber Growth</h3>
                <div className="h-64">
                  <Line
                    data={historicalData}
                    dataKey="subscribers"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                  />
                </div>
              </div>

              {/* Views Trend Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Views Trend</h3>
                <div className="h-64">
                  <Bar
                    data={historicalData}
                    dataKey="views"
                    fill="#7C3AED"
                    radius={[4, 4, 0, 0]}
                  />
                </div>
              </div>
            </motion.div>

            {/* Top Performing Videos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Top Performing Videos</h3>
                <FiBarChart2 className="text-blue-500" />
              </div>
              <div className="space-y-4">
                {topVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 line-clamp-1">{video.title}</h4>
                        <p className="text-sm text-gray-500">{new Date(video.published_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{video.view_count.toLocaleString()} views</p>
                      <p className="text-sm text-gray-500">{video.like_count.toLocaleString()} likes</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Channel Performance Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Channel Insights</h3>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Last 30 Days
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Engagement Rate */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Engagement Rate</h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-gray-800">
                      {((latestStats.likes / latestStats.view_count) * 100).toFixed(1)}%
                    </div>
                    <span className="text-sm text-green-600">↑ 2.3%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(latestStats.likes / latestStats.view_count) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Average Views per Video */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Avg. Views per Video</h4>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.round(latestStats.view_count / latestStats.video_count).toLocaleString()}
                    </div>
                    <span className="text-sm text-green-600">↑ 5.7%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-purple-500 rounded-full" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div ref={sidebarRef} className="h-full">
        <Sidebar setActiveComponent={setActiveComponent} isCollapsed={isCollapsed} />
      </div>
      <div className={`flex flex-col flex-1 ${isCollapsed ? 'ml-16' : 'ml-72'} transition-all duration-300 ease-in-out`}>
        <Navbar />
        <main className="p-6 lg:p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-blue-600 font-medium">Loading your YouTube insights...</p>
                </div>
              </div>
            ) : (
              renderComponent()
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;