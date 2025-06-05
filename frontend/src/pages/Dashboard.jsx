import { useState, useEffect } from "react";
import { Sidebar, Analytics, Audience, Settings, Instagram, Facebook, Twitter, Youtube } from "../components";
import Overview from "../components/Overview";
import InsightsAndRecommendations from "../components/InsightsAndRecommendations";
import { FiCalendar, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaFacebookF } from 'react-icons/fa';
import useApi from "../components/useApi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/context/ThemeContext";
import AIAssistant from '../components/AIAssistant';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../components/Onboarding';

function Dashboard() {
  // All hooks at the top, before any return
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'User';
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: status, loading: statusLoading } = useApi('/api/account_status/');
  const { data: yt, loading: ytLoading, error: ytError } = useApi(status?.youtube ? '/youtube/stats' : null);
  const { data: tw, loading: twLoading, error: twError } = useApi(status?.twitter ? '/twitter/stats' : null);

  // If no accounts are connected, show onboarding, else show dashboard
  const noAccountsConnected = !status || (!status.youtube && !status.twitter && !status.instagram && !status.facebook && !status.linkedin);

  // Store tokens from URL after YouTube OAuth (if present)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'youtube') {
      const access = params.get('access');
      const refresh = params.get('refresh');
      if (access && refresh) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        // Remove tokens from URL for cleanliness
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Show loading spinner while any API is fetching data
  if (statusLoading || ytLoading || twLoading) {
    return (
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg text-gray-500">Analyzing...</span>
        </div>
      </div>
    );
  }

  if (noAccountsConnected) {
    return <Onboarding />;
  }

  // If stats error, treat as zero data for that platform
  const ytData = yt?.data || [];
  const twData = tw?.data || [];
  const latestYt = ytData[ytData.length - 1] || {};
  const latestTw = twData[twData.length - 1] || {};

  const hasConnectedAccounts = !noAccountsConnected;

  const renderDashboard = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics ytData={ytData} twData={twData} latestYt={latestYt} latestTw={latestTw} />;
      case "Audience":
        return <Audience />;
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
          <div className="p-6 space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {username}'s Dashboard
                </h1>
                <div className={`flex items-center mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                {/* Removed Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${isDarkMode
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
            <Overview data={yt} />

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
              {status?.twitter && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl border ${isDarkMode
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
              )}
              {/* YouTube Stats */}
              {status?.youtube && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`p-6 rounded-xl border ${isDarkMode
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
              )}
            </div>
          </div>
        );
    }
  };

  const dashboardTransition = isCollapsed
    ? 'transition-all duration-300 delay-200' // Delay when collapsing
    : 'transition-all duration-300';

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Only show Sidebar if user has connected accounts */}
      {hasConnectedAccounts ? (
        <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      ) : null}
      <div
        className={`flex-1 pt-16 ${dashboardTransition} ${
          hasConnectedAccounts
            ? isCollapsed
              ? 'ml-20' // Collapsed sidebar width
              : 'ml-64' // Expanded sidebar width
            : 'w-full'
        }`}
      >
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
        <AIAssistant />
      </div>
    </div>
  );
}

export default Dashboard;