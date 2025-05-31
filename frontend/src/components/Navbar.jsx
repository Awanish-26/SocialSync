import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FiUser, FiSearch, FiBell, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New follower milestone reached!" },
    { id: 2, text: "Engagement up by 25% this week" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('name');
    window.location.href = '/login';
  };

  return (
    <AnimatePresence>
      {isAuthenticated ? (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed left-0 right-0 top-0 z-50"
        >
          <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold select-none">
                  SocialSync
                </h2>
              </div>

              {/* Search Bar */}
              <div className="relative items-center max-w-md w-full mx-4 hidden md:block">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search profiles or metrics..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-6">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FiBell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                      >
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <p className="text-sm text-gray-600">{notification.text}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {userName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                      {userName}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                      >
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <FiSettings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.header>
      ) : (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link
              to="/"
              className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold"
            >
              SocialSync
            </Link>

            <div className="space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default Navbar;
