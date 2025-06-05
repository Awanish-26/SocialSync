import { useState, useRef, useContext } from "react";
import { Sidebar, Analytics, Audience, Settings, Instagram, Facebook, Twitter, Youtube, SidebarContext } from "../components";
import Overview from "../components/Overview";
import InsightsAndRecommendations from "../components/InsightsAndRecommendations";
import { FiCalendar, FiRefreshCw, FiDownload, FiUsers, FiEye, FiThumbsUp, FiPlus, FiTrendingUp, FiBarChart2, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaFacebookF } from 'react-icons/fa';
import useApi from "../components/useApi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/context/ThemeContext";
import AIAssistant from '../components/AIAssistant';
import apiClient from "../utils/apiClient";
import Onboarding from '../components/Onboarding';



function Dashboard() {
  const { isDarkMode } = useTheme();
  // Get username from localStorage (set by Navbar)
  const username = localStorage.getItem('name') || 'User';
  const [activeComponent, setActiveComponent] = useState("Dashboard"); // Set default to 'Dashboard'
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Account filter state
  const [accountFilter, setAccountFilter] = useState("All"); // 'All', 'YouTube', 'Twitter', 'LinkedIn'

  // Fetch connection status
  const { data: status, loading: statusLoading } = useApi('/api/get_account_status/');

  // Fetch stats as before
  const { data: yt, loading: ytLoading, error: ytError } = useApi('/youtube/stats');
  const { data: tw, loading: twLoading, error: twError } = useApi('/twitter/stats');
  // TODO: Add LinkedIn API if available

  // Show loading spinner if any API is loading
  if (statusLoading || ytLoading || twLoading) {
    return (
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  // If no accounts are connected, show onboarding
  const noAccountsConnected = status && !status.youtube && !status.twitter && !status.instagram && !status.facebook && !status.linkedin;
  if (noAccountsConnected) {
    return <Onboarding />;
  }

  // If stats error, treat as zero data for that platform
  const ytData = yt?.data || [];
  const twData = tw?.data || [];
  const latestYt = ytData[ytData.length - 1] || {};
  const latestTw = twData[twData.length - 1] || {};

  // Calculate total metrics based on filter
  let totalFollowers = 0, totalLikes = 0, totalViews = 0;
  let filteredYt = ytData, filteredTw = twData;
  if (accountFilter === "All") {
    totalFollowers = (latestYt.subscriber_count || 0) + (latestTw.followers_count || 0);
    totalLikes = (latestYt.likes || 0) + (latestTw.likes_count || 0);
    totalViews = (latestYt.view_count || 0) + (latestTw.views || 0);
  } else if (accountFilter === "YouTube") {
    totalFollowers = latestYt.subscriber_count || 0;
    totalLikes = latestYt.likes || 0;
    totalViews = latestYt.view_count || 0;
    filteredTw = [];
  } else if (accountFilter === "Twitter") {
    totalFollowers = latestTw.followers_count || 0;
    totalLikes = latestTw.likes_count || 0;
    totalViews = latestTw.views || 0;
    filteredYt = [];
  } else if (accountFilter === "LinkedIn") {
    // TODO: Add LinkedIn stats if available
    filteredYt = [];
    filteredTw = [];
  }

  const hasConnectedAccounts = !noAccountsConnected;

  // Account filter options based on connected accounts
  const filterOptions = [
    { label: "All", value: "All" },
    ...(status?.youtube ? [{ label: "YouTube", value: "YouTube" }] : []),
    ...(status?.instagram ? [{ label: "Instagram", value: "Instagram" }] : []),
    ...(status?.twitter ? [{ label: "Twitter", value: "Twitter" }] : []),
    ...(status?.facebook ? [{ label: "Facebook", value: "Facebook" }] : []),
    ...(status?.linkedin ? [{ label: "LinkedIn", value: "LinkedIn" }] : []),
  ];

  const renderDashboard = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics accountFilter={accountFilter} ytData={filteredYt} twData={filteredTw} latestYt={latestYt} latestTw={latestTw} />;
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
              {/* Account Filter Dropdown */}
              <select
                value={accountFilter}
                onChange={e => setAccountFilter(e.target.value)}
                className={`px-3 py-1 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-300'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
                style={{ minWidth: 120 }}
              >
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${isDarkMode
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
            <Overview data={{
              totalFollowers,
              totalLikes,
              totalViews,
              ytData: filteredYt,
              twData: filteredTw
            }} />

            {/* Insights and Recommendations */}
            <InsightsAndRecommendations data={{
              ytData: filteredYt,
              twData: filteredTw,
              latestYt,
              latestTw
            }} />

            {/* Platform-specific Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Twitter Stats */}
              {accountFilter !== "YouTube" && status?.twitter && (
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
              {accountFilter !== "Twitter" && status?.youtube && (
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

  // Calculate transition delay for dashboard margin
  const dashboardTransition = isCollapsed
    ? 'transition-all duration-300 delay-200' // Delay when collapsing
    : 'transition-all duration-300'; // No delay when expanding

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