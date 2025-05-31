import { useContext, useState } from 'react';
import { SidebarContext } from '../components/context/SidebarContext';
import { FiHome, FiPieChart, FiUsers, FiSettings, FiMenu } from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sidebar = ({ setActiveComponent }) => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, component: 'Dashboard' },
    { id: 'analytics', label: 'Analytics', icon: FiPieChart, component: 'Analytics' },
    { id: 'audience', label: 'Audience', icon: FiUsers, component: 'Audience' },
    { id: 'settings', label: 'Settings', icon: FiSettings, component: 'Settings' },
  ];

  const socialItems = [
    { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-500', component: 'Instagram' },
    { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600', component: 'Facebook' },
    { id: 'twitter', label: 'X (Twitter)', icon: FaTwitter, color: 'text-blue-400', component: 'Twitter' },
    { id: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-500', component: 'Youtube' },
  ];

  const handleItemClick = (component) => {
    setActiveItem(component);
    setActiveComponent(component);
  };

  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="flex"
    >
      <div 
        className={`fixed left-0 h-screen ${
          isCollapsed ? 'w-16' : 'w-72'
        } bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold">
                SocialSync
              </h2>
            </motion.div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Main Menu */}
        <div className="py-4">
          <div className="px-3">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => handleItemClick(item.component)}
                className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg text-left transition-colors ${
                  activeItem === item.component
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  activeItem === item.component ? 'text-blue-600' : 'text-gray-500'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm">
                    {item.label}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Social Profiles Section */}
        <div className="py-4 border-t border-gray-100">
          {!isCollapsed && (
            <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Social Profiles
            </h3>
          )}
          <div className="px-3">
            {socialItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => handleItemClick(item.component)}
                className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg text-left transition-colors ${
                  activeItem === item.component
                    ? 'bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                {!isCollapsed && (
                  <span className={`ml-3 font-medium text-sm ${
                    activeItem === item.component ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">
                Pro Tip: Use keyboard shortcuts for quick navigation
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;