import { useContext } from 'react';
import { SidebarContext } from './context/SidebarContext';
import { FaTachometerAlt, FaChartBar, FaUsers, FaCog, FaInstagram, FaFacebook, FaTwitter, FaBars, FaYoutube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

const MenuItem = ({ icon: Icon, label, onClick, isCollapsed, isActive }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.li
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-3 flex items-center cursor-pointer transition-all duration-200 ${isActive
        ? `${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`
        : `${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
        } rounded-lg mx-2`}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 ${isActive ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : ''}`} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="ml-3 whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const { isDarkMode } = useTheme();

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', id: 'Dashboard' },
    { icon: FaChartBar, label: 'Analytics', id: 'Analytics' },
    { icon: FaUsers, label: 'Audience', id: 'Audience' },
    { icon: FaCog, label: 'Settings', id: 'Settings' },
  ];

  const socialItems = [
    { icon: FaInstagram, label: 'Instagram', id: 'Instagram', color: 'text-pink-500' },
    { icon: FaFacebook, label: 'Facebook', id: 'Facebook', color: 'text-blue-500' },
    { icon: FaTwitter, label: 'Twitter', id: 'Twitter', color: 'text-blue-400' },
    { icon: FaYoutube, label: 'Youtube', id: 'Youtube', color: 'text-red-500' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className={`fixed left-0 h-screen z-30 border-r transition-all duration-200 ${isDarkMode
          ? 'bg-gray-800 border-gray-700/50 text-gray-200'
          : 'bg-white border-gray-200 text-gray-900'
        }`}
    >
      <div className={`flex items-center justify-between h-16 px-4 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
        }`}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-xl font-bold">
                SocialSync
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <FaBars size={18} />
        </motion.button>
      </div>

      <div className="py-4">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                onClick={() => setActiveComponent(item.id)}
                isCollapsed={isCollapsed}
                isActive={activeComponent === item.id}
              />
            ))}
          </ul>
        </nav>

        <div className="mt-8">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`px-6 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
              >
                Social Accounts
              </motion.h3>
            )}
          </AnimatePresence>
          <ul className="space-y-2">
            {socialItems.map((item) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                onClick={() => setActiveComponent(item.id)}
                isCollapsed={isCollapsed}
                isActive={activeComponent === item.id}
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;