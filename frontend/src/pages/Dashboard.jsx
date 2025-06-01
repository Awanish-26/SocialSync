import { useState, useRef, useContext } from "react";
import { Sidebar, Analytics, Audience, Settings, Instagram, Facebook, Twitter, Youtube, SidebarContext } from "../components";
import Overview from "../components/Overview";
import InsightsAndRecommendations from "../components/InsightsAndRecommendations";
import { mockProfiles, getProfileMetrics, getTimeSeriesData, generateRecommendations } from "../utils/mockData";
import { FiCalendar, FiRefreshCw, FiDownload, FiUsers, FiEye, FiThumbsUp, FiPlus } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import useApi from "../components/useApi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/context/ThemeContext";

const ConnectAccountCard = ({ platform, icon: Icon, color, onClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-indigo-500/30' 
          : 'bg-white border-gray-200 hover:border-indigo-500/50 hover:shadow-lg'
      } p-6 rounded-xl border transition-all duration-200`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
        Connect {platform}
      </h3>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
        Analyze your {platform} metrics and grow your audience
      </p>
      <button className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
        <FiPlus className="mr-2" />
        Connect Account
      </button>
    </motion.div>
  );
};

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const sidebarRef = useRef(null);
  const { isCollapsed } = useContext(SidebarContext);
  const { isDarkMode } = useTheme();

  // Fetch real data from backend
  const yt = useApi('youtube/stats/');
  const tw = useApi('api/twitter/status/');

  // Loading and error handling
  if (yt.loading || tw.loading) {
    return (
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (yt.error || tw.error) {
    return (
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <div className="flex justify-center items-center h-screen text-red-500">
            Error loading data. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Extract real data
  const ytData = yt.data?.data || [];
  const twData = tw.data?.data || [];
  const latestYt = ytData[ytData.length - 1] || {};
  const latestTw = twData[twData.length - 1] || {};

  // Calculate total metrics
  const totalFollowers = (latestYt.subscriber_count || 0) + (latestTw.followers_count || 0);
  const totalLikes = (latestYt.likes || 0) + (latestTw.likes_count || 0);
  const totalViews = (latestYt.view_count || 0) + (latestTw.views || 0);

  const renderDashboard = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics selectedProfile={mockProfiles[0]} />;
      case "Audience":
        return <Audience selectedProfile={mockProfiles[0]} />;
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
        const hasConnectedAccounts = totalFollowers > 0 || totalLikes > 0 || totalViews > 0;

        return hasConnectedAccounts ? (
          <div className="p-6 space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dashboard
                </h1>
                <div className={`flex items-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  Export
                </motion.button>
              </div>
            </div>

            {/* Overview Section */}
            <Overview data={{
              totalFollowers,
              totalLikes,
              totalViews,
              ytData,
              twData
            }} />

            {/* Insights and Recommendations */}
            <InsightsAndRecommendations data={{
              ytData,
              twData,
              latestYt,
              latestTw
            }} />

            {/* Platform-specific Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Twitter Stats */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaTwitter className="w-6 h-6 text-blue-400" />
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Twitter Performance
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Followers</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {latestTw.followers_count?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Engagement Rate</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {((latestTw.likes_count || 0) / (latestTw.followers_count || 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* YouTube Stats */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-6 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaYoutube className="w-6 h-6 text-red-500" />
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    YouTube Performance
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscribers</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {latestYt.subscriber_count?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {latestYt.view_count?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-12">
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to SocialSync!
              </h1>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Connect your social media accounts to start tracking your growth and engagement across platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <ConnectAccountCard
                platform="Instagram"
                icon={FaInstagram}
                color="bg-gradient-to-br from-purple-600 to-pink-500"
                onClick={() => setActiveComponent("Instagram")}
              />
              <ConnectAccountCard
                platform="YouTube"
                icon={FaYoutube}
                color="bg-gradient-to-br from-red-600 to-red-500"
                onClick={() => setActiveComponent("Youtube")}
              />
              <ConnectAccountCard
                platform="Twitter"
                icon={FaTwitter}
                color="bg-gradient-to-br from-blue-500 to-blue-400"
                onClick={() => setActiveComponent("Twitter")}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 pt-16`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;