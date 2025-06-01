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

// Account card details for all platforms
const accountCardDetails = [
  {
    platform: 'Facebook',
    icon: FaFacebookF,
    color: 'bg-gradient-to-br from-blue-800 to-blue-500',
    buttonText: 'Connect Facebook',
    description: 'Manage your Facebook page insights and audience engagement.'
  },
  {
    platform: 'Instagram',
    icon: FaInstagram,
    color: 'bg-gradient-to-br from-purple-600 to-pink-500',
    buttonText: 'Connect Instagram',
    description: 'Analyze your Instagram growth, engagement, and content performance.'
  },
  {
    platform: 'Twitter',
    icon: FaTwitter,
    color: 'bg-gradient-to-br from-blue-500 to-blue-400',
    buttonText: 'Connect Twitter',
    description: 'Monitor your Twitter followers, likes, and tweet performance.'
  },
  {
    platform: 'YouTube',
    icon: FaYoutube,
    color: 'bg-gradient-to-br from-red-600 to-red-500',
    buttonText: 'Connect YouTube',
    description: 'Track your YouTube subscribers, views, and video analytics.'
  },
  {
    platform: 'LinkedIn',
    icon: FaLinkedin,
    color: 'bg-gradient-to-br from-blue-700 to-blue-400',
    buttonText: 'Connect LinkedIn',
    description: 'Grow your professional network and analyze your LinkedIn reach.'
  },
  
];

// Renders a platform card for connecting social accounts.
const ConnectAccountCard = ({ platform, icon: Icon, color, buttonText, description }) => {
  const { isDarkMode } = useTheme();

  // Generic OAuth/connection handler for all platforms
  const handleConnect = async (e) => {
    e.stopPropagation();
    try {
      let endpoint = platform.toLowerCase();
      const supported = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'];
      if (!supported.includes(endpoint)) {
        alert(`Connection for ${platform} is not supported yet.`);
        return;
      }
      let res;
      if (endpoint === 'youtube') {
        res = await apiClient.get(`${endpoint}/initiate/`);
      } else {
        res = await apiClient.post(`${endpoint}/initiate/`);
      }
      if (res.status === 200 && (res.data.authorization_url || res.data.redirect_url)) {
        window.location.href = res.data.authorization_url || res.data.redirect_url;
      } else {
        alert(`Failed to authenticate with ${platform}. Backend did not return a redirect URL.`);
      }
    } catch (err) {
      // Enhanced error logging for debugging
      if (err.response) {
        alert(`Error: ${err.response.status} ${err.response.statusText}\n${JSON.stringify(err.response.data)}`);
        console.error('Full error response:', err.response);
      } else {
        alert(`Authentication for ${platform} failed or is not available. Please check your backend endpoints.\n${err.message}`);
        console.error(err);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-center justify-between h-full ${
        isDarkMode 
          ? 'bg-gray-800/70 border-gray-700/70 hover:border-indigo-500/40' 
          : 'bg-white border-gray-200 hover:border-indigo-500/50 hover:shadow-lg'
      } p-6 rounded-2xl border transition-all duration-200 shadow-md`}
    >
      <div className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>Connect {platform}</h3>
      <p className={`mb-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>{description}</p>
      <button
        className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-lg shadow-md
          ${isDarkMode
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
        type="button"
        onClick={handleConnect}
      >
        {buttonText || `Connect ${platform}`}
      </button>
    </motion.div>
  );
};

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const sidebarRef = useRef(null);
  const { isCollapsed } = useContext(SidebarContext);
  const { isDarkMode } = useTheme();
  const [scrollX, setScrollX] = useState(0);
  const scrollRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const visibleCards = 3;
  const totalCards = accountCardDetails.length;

  // Helper to get the visible cards in a loop
  function getVisibleCards() {
    return Array.from({ length: visibleCards }).map((_, i) => {
      const idx = (carouselIndex + i) % totalCards;
      return accountCardDetails[idx];
    });
  }

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
    // connect and onboarding sections if no accounts are connected
    const ytData = yt.data?.data || [];
    const twData = tw.data?.data || [];
    const latestYt = ytData[ytData.length - 1] || {};
    const latestTw = twData[twData.length - 1] || {};
    const totalFollowers = (latestYt.subscriber_count || 0) + (latestTw.followers_count || 0);
    const totalLikes = (latestYt.likes || 0) + (latestTw.likes_count || 0);
    const totalViews = (latestYt.view_count || 0) + (latestTw.views || 0);
    const hasConnectedAccounts = totalFollowers > 0 || totalLikes > 0 || totalViews > 0;
    if (!hasConnectedAccounts) {
      return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}> 
          {/* Sidebar removed if no accounts connected */}
          <main className={`flex-1 w-full transition-all duration-300 pt-16 px-2 md:px-8`}>  
            <section className="max-w-5xl mx-auto py-8">
              <div className="text-center mb-2">
                <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to SocialSync!</h1>
                <p className={`max-w-2xl mx-auto text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Connect your social media accounts to unlock powerful analytics, insights, and growth tools for your brand or business.</p>
              </div>
              <div className="relative mb-8 w-full" style={{ minHeight: 400 }}>
                <div className="flex w-full justify-center items-center relative" style={{ minHeight: 500 }}>
                  {/* Carousel container */}
                  <div className="flex gap-6 w-full justify-center relative" style={{ maxWidth: '1200px', width: '100%' }}>
                    {getVisibleCards().map((acc, i) => (
                      <div
                        key={acc.platform + carouselIndex}
                        style={{
                          minWidth: '340px',
                          maxWidth: '380px',
                          flex: '1 1 0',
                          height: '370px',
                          display: 'flex',
                          alignItems: 'stretch',
                          zIndex: 1,
                          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', // smooth scroll effect
                          transform: `translateX(0)`
                        }}
                      >
                        <ConnectAccountCard
                          platform={acc.platform}
                          icon={acc.icon}
                          color={acc.color}
                          onClick={() => setActiveComponent(acc.platform)}
                          buttonText={acc.buttonText}
                          description={acc.description}
                          setActiveComponent={setActiveComponent}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Carousel Nav Buttons */}
                  <div
                    className="flex flex-col gap-3 items-center justify-center ml-8"
                    style={{ height: '120px' }}
                  >
                    <button
                      aria-label="Previous"
                      className={`rounded-full p-4 shadow-md border border-indigo-200 bg-white hover:bg-indigo-100 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-indigo-900' : ''}`}
                      onClick={() => {
                        setDirection(-1);
                        setCarouselIndex((prev) => (prev - 1 + totalCards) % totalCards);
                      }}
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      aria-label="Next"
                      className={`rounded-full p-4 shadow-md border border-indigo-200 bg-white hover:bg-indigo-100 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-indigo-900' : ''}`}
                      onClick={() => {
                        setDirection(1);
                        setCarouselIndex((prev) => (prev + 1) % totalCards);
                      }}
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
              {/* How SocialSync Helps Section */}
              <section className={`rounded-2xl shadow-xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-900 border border-indigo-900' : 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border border-indigo-200'}`}> 
                <div className="flex-1">
                  <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>How SocialSync Helps You</h2>
                  <ul className={`list-none space-y-4 text-base md:text-lg font-medium ${isDarkMode ? 'text-indigo-100' : 'text-indigo-900'}`}> 
                    <li className="flex items-center gap-3"><span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20"><FiTrendingUp className="text-indigo-500 w-6 h-6" /></span> Unified analytics for all your social media platforms</li>
                    <li className="flex items-center gap-3"><span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20"><FiBarChart2 className="text-green-500 w-6 h-6" /></span> Actionable insights and recommendations</li>
                    <li className="flex items-center gap-3"><span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/20"><FiActivity className="text-pink-500 w-6 h-6" /></span> Track engagement, followers, and content performance</li>
                    <li className="flex items-center gap-3"><span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20"><FiUsers className="text-yellow-500 w-6 h-6" /></span> Collaborate with your team and manage multiple accounts</li>
                    <li className="flex items-center gap-3"><span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20"><FiDownload className="text-blue-500 w-6 h-6" /></span> Export reports and share insights easily</li>
                  </ul>
                </div>
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="hidden md:flex flex-col items-center gap-6"
                >
                  <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/10 mb-2">
                    <FiBarChart2 className="text-indigo-500 w-16 h-16" />
                  </span>
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10">
                    <FiUsers className="text-green-500 w-10 h-10" />
                  </span>
                </motion.div>
              </section>
              {/* Why Connect Section */}
              <section className={`rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}> 
                <div className="flex-1">
                  <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Why Connect Your Accounts?</h2>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    SocialSync can only analyze and help you manage your social media if you connect your accounts. Get started to unlock powerful analytics, recommendations, and more.
                  </p>
                </div>
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="hidden md:flex flex-col items-center gap-4"
                >
                  <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 mb-2">
                    <FiDownload className="text-indigo-500 w-12 h-12" />
                  </span>
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10">
                    <FiUsers className="text-yellow-500 w-8 h-8" />
                  </span>
                </motion.div>
              </section>
              {/* What Can You Do Section */}
              <section className={`rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900 via-gray-900 to-gray-800 border border-indigo-900' : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-50 border border-indigo-200'}`}> 
                <div className="flex-1">
                  <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>What Can You Do With SocialSync?</h2>
                  <ul className={`list-disc pl-5 space-y-2 ${isDarkMode ? 'text-indigo-100' : 'text-indigo-900'}`}>
                    <li>Monitor all your social media metrics in real time</li>
                    <li>Compare performance across platforms</li>
                    <li>Discover best times to post and top-performing content</li>
                    <li>Collaborate with your team and manage multiple accounts</li>
                    <li>Export reports and share insights easily</li>
                  </ul>
                </div>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="hidden md:flex flex-col items-center gap-4"
                >
                  <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-500/10 mb-2">
                    <FiActivity className="text-pink-500 w-12 h-12" />
                  </span>
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10">
                    <FiTrendingUp className="text-blue-500 w-8 h-8" />
                  </span>
                </motion.div>
              </section>
              {/* Key Features Section*/}
              <section className={`rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-gray-900 border border-indigo-900' : 'bg-white border border-indigo-200'}`}> 
                <div className="flex-1">
                  <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Key Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-bold text-lg flex items-center gap-2"><FiBarChart2 className="w-6 h-6 text-indigo-500" /> Unified Dashboard</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>See all your social media metrics in one place.</span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-bold text-lg flex items-center gap-2"><FiDownload className="w-6 h-6 text-green-500" /> Smart Scheduling</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Plan and schedule posts for maximum engagement.</span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-bold text-lg flex items-center gap-2"><FiUsers className="w-6 h-6 text-yellow-500" /> Team Collaboration</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Work with your team to manage accounts efficiently.</span>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-bold text-lg flex items-center gap-2"><FiTrendingUp className="w-6 h-6 text-pink-500" /> AI Insights</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Get AI-powered recommendations to grow faster.</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0.8, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="hidden md:flex flex-col items-center gap-6"
                >
                  <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/10 mb-2">
                    <FiBarChart2 className="text-indigo-500 w-16 h-16" />
                  </span>
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10">
                    <FiUsers className="text-green-500 w-10 h-10" />
                  </span>
                </motion.div>
              </section>
            </section>
          </main>
        </div>
      );
    }
    // If error but accounts are connected, show error
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
        return <Analytics />;
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
                setActiveComponent={setActiveComponent}
              />
              <ConnectAccountCard
                platform="YouTube"
                icon={FaYoutube}
                color="bg-gradient-to-br from-red-600 to-red-500"
                onClick={() => setActiveComponent("Youtube")}
                setActiveComponent={setActiveComponent}
              />
              <ConnectAccountCard
                platform="Twitter"
                icon={FaTwitter}
                color="bg-gradient-to-br from-blue-500 to-blue-400"
                onClick={() => setActiveComponent("Twitter")}
                setActiveComponent={setActiveComponent}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Only show Sidebar if user has connected accounts */}
      {totalFollowers > 0 || totalLikes > 0 || totalViews > 0 ? (
        <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      ) : null}
      <div className={`flex-1 ${totalFollowers > 0 || totalLikes > 0 || totalViews > 0 ? (isCollapsed ? 'ml-20' : 'ml-64') : 'w-full'} transition-all duration-300 pt-16`}>
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