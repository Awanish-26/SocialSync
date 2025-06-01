import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FiUser, FiSearch, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const checkAuth = () => {
    const token = localStorage.getItem('access');
    const name = localStorage.getItem('name');
    setIsAuthenticated(!!token);
    setUserName(name || "User");
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);

    // Add custom event listener for auth changes
    window.addEventListener('authStateChanged', checkAuth);

    // Cleanup
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('name');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));
    
    setIsAuthenticated(false);
    setShowDropdown(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-md border-b transition-colors duration-200`}
    >
      <div className="max-w-full mx-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-2xl font-bold select-none">
              SocialSync
            </h2>
          </Link>

          {/* Center Section */}
          {isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search analytics, metrics, or profiles..."
                  className={`w-full pl-10 pr-4 py-2 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
                  } border rounded-lg focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'} transition-colors`}
                >
                  <IoMdNotificationsOutline className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
                </motion.button>
                
                <div className="relative user-menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className={`flex items-center space-x-3 ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50 text-gray-200 hover:bg-gray-600/50'
                        : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
                    } px-4 py-2 rounded-lg border transition-all`}
                  >
                    <FiUser className="w-5 h-5" />
                    <span>{userName}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute right-0 mt-2 w-48 ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700/50 text-gray-300'
                            : 'bg-white border-gray-200 text-gray-700'
                        } rounded-lg shadow-lg border overflow-hidden`}
                      >
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full px-4 py-2 ${
                            isDarkMode
                              ? 'hover:bg-gray-700/50'
                              : 'hover:bg-gray-100'
                          } transition-colors`}
                        >
                          <FiLogOut className="mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  } transition-colors`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
