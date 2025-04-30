import React, { useState } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaCog, FaInstagram, FaFacebook, FaTwitter, FaBars ,FaYoutube } from 'react-icons/fa';


const Sidebar = ({ setActiveComponent }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <div className={`min-h-screen ${isCollapsed ? 'w-16' : 'md:w-72'} bg-gray-800 text-white transition-all duration-300`}>
        <div className="p-6 flex justify-between items-center">
          {!isCollapsed && <h2 className="text-2xl font-bold">SocialSync</h2>}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaBars size={20} />
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Dashboard')}
            >
              <FaTachometerAlt className="mr-2 ml-2" />
              {!isCollapsed && 'Dashboard'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Analytics')}
            >
              <FaChartBar className="mr-2 ml-2" />
              {!isCollapsed && 'Analytics'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Audience')}
            >
              <FaUsers className="mr-2 ml-2" />
              {!isCollapsed && 'Audience'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Settings')}
            >
              <FaCog className="mr-2 ml-2" />
              {!isCollapsed && 'Settings'}
            </li>
          </ul>
        </nav>
        <div className="mt-10">
          {!isCollapsed && <h3 className="px-4 text-lg font-semibold">Connect Social Profiles</h3>}
          <ul className="mt-4">
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Instagram')}
            >
              <FaInstagram className="mr-2 ml-2 text-pink-500" />
              {!isCollapsed && 'Instagram'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Facebook')}
            >
              <FaFacebook className="mr-2 ml-2 text-blue-500" />
              {!isCollapsed && 'Facebook'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Twitter')}
            >
              <FaTwitter className="mr-2 ml-2 text-blue-400" />
              {!isCollapsed && 'X (Twitter)'}
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Youtube')}
              >
              <FaYoutube className="mr-2 ml-2 text-red-500" />
              {!isCollapsed && 'Youtube'}
              </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;