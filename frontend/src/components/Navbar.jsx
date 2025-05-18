import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi'
import { IoMdNotificationsOutline } from "react-icons/io";

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
    <>
      {
        isAuthenticated ? (
          <header className={`fixed left-0 right-0 top-0 flex items-center justify-between bg-white/80 backdrop-blur-md shadow px-6 py-4 transition-[width] duration-300 `}>
            <div className="flex items-center space-x-4">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-3xl font-bold select-none ml-16">SocialSync</h2>
            </div>
            <div className="relative items-center space-x-4 w-1/3 ">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="search-input"
                name="search"
                type="text"
                placeholder="Search profiles or metrics..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <IoMdNotificationsOutline className="text-gray-600 h-6 w-6" />
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600 rounded-full w-6 h-6" />
                <button>{userName}</button>
              </div>
            </div>
          </header>
        ) :
          (
            <nav className="flex justify-between items-center px-12 py-4 bg-white shadow-md sticky top-0 z-50" >
              <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-3xl font-bold ">SocialSync</Link>

              <div className="space-x-4">
                <Link to="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded ">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded">
                  Sign Up
                </Link>
              </div>
            </nav>
          )
      }
    </>
  );
}

export default Navbar;
