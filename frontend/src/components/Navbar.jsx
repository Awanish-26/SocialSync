/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FiUser, FiSearch } from 'react-icons/fi'
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion } from 'framer-motion';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

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

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {isAuthenticated ? (
        <header className="fixed left-0 right-0 top-0 flex items-center justify-between bg-[#1E293B]/80 backdrop-blur-md border-b border-indigo-500/10 px-6 py-4 transition-all duration-300 z-50">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 text-3xl font-bold select-none ml-16">
                SocialSync
              </h2>
            </Link>
          </div>
          <div className="relative items-center space-x-4 w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="search-input"
              name="search"
              type="text"
              placeholder="Search profiles or metrics..."
              className="pl-10 pr-4 py-2 bg-[#0F172A]/80 border border-indigo-500/20 rounded-lg w-full text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <IoMdNotificationsOutline className="text-gray-400 hover:text-indigo-400 h-6 w-6 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </motion.button>
            <motion.div
              className="flex items-center space-x-3 bg-[#0F172A]/50 px-4 py-2 rounded-lg border border-indigo-500/20 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUser className="text-gray-400 w-5 h-5" />
              <span className="text-gray-300">{userName}</span>
            </motion.div>
          </div>
        </header>
      ) : (
        <nav className="flex justify-between items-center px-12 py-4 bg-[#1E293B]/80 backdrop-blur-md border-b border-indigo-500/10 sticky top-0 z-50">
          <Link to="/">
            <motion.h2
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 text-3xl font-bold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              SocialSync
            </motion.h2>
          </Link>

          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 bg-[#0F172A] border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 font-semibold rounded-lg transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </motion.div>
  );
}

export default Navbar;
